// src/services/UserPlantsService.ts

import { supabase } from "../lib/supabase";
import { addDays, addWeeks, addMonths, format } from "date-fns";

export type TaskUnit = "day" | "week" | "month";

export interface TaskFrequencyInput {
    enabled: boolean;
    interval: number | null;
    unit: TaskUnit | null;
}

export interface NewPlantInput {
    name: string;
    scientificName: string;
    iconIndex: number | null;
    watering: TaskFrequencyInput;
    pruning: TaskFrequencyInput;
    fertilizing: TaskFrequencyInput;
}

export type UpdatePlantInput = NewPlantInput;

export interface UserPlant {
    id: string;
    name: string;
    scientific_name: string | null;
    icon: string | null;
    is_active: boolean;
    watering_interval: number | null;
    watering_unit: TaskUnit | null;
    watering_enabled: boolean;
    pruning_interval: number | null;
    pruning_unit: TaskUnit | null;
    pruning_enabled: boolean;
    fertilizer_interval: number | null;
    fertilizer_unit: TaskUnit | null;
    fertilizer_enabled: boolean;
}

function addInterval(date: Date, interval: number, unit: TaskUnit): Date {
    switch (unit) {
        case "day":
            return addDays(date, interval);
        case "week":
            return addWeeks(date, interval);
        case "month":
            return addMonths(date, interval);
    }
}

export async function getUserPlants(userId: string): Promise<UserPlant[]> {
    const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

/* Registra la planta y crea la primera tarea automática (hoy + intervalo) de cada tipo activado */
export async function registerPlant(input: NewPlantInput, userId: string) {
    const { data, error } = await supabase
        .from("plants")
        .insert({
            user_id: userId,
            name: input.name,
            scientific_name: input.scientificName,
            icon: input.iconIndex,
            watering_interval: input.watering.enabled ? input.watering.interval : null,
            watering_unit: input.watering.enabled ? input.watering.unit : null,
            watering_enabled: input.watering.enabled,
            pruning_interval: input.pruning.enabled ? input.pruning.interval : null,
            pruning_unit: input.pruning.enabled ? input.pruning.unit : null,
            pruning_enabled: input.pruning.enabled,
            fertilizer_interval: input.fertilizing.enabled ? input.fertilizing.interval : null,
            fertilizer_unit: input.fertilizing.enabled ? input.fertilizing.unit : null,
            fertilizer_enabled: input.fertilizing.enabled,
        })
        .select()
        .single();

    if (error) throw error;

    await createInitialAutomaticTasks(data.id, userId, input);

    return data;
}

async function createInitialAutomaticTasks(plantId: string, userId: string, input: NewPlantInput) {
    const today = new Date();
    const rows: any[] = [];

    (
        [
            ["watering", input.watering],
            ["pruning", input.pruning],
            ["fertilizing", input.fertilizing],
        ] as const
    ).forEach(([taskType, freq]) => {
        if (freq.enabled && freq.interval && freq.unit) {
            rows.push({
                user_id: userId,
                plant_id: plantId,
                task_type: taskType,
                is_automatic: true,
                label: null,
                due_date: format(addInterval(today, freq.interval, freq.unit), "yyyy-MM-dd"),
                completed: false,
            });
        }
    });

    if (rows.length === 0) return;

    const { error } = await supabase.from("plant_tasks").insert(rows);
    if (error) throw error;
}

export async function updatePlant(
    plantId: string,
    input: UpdatePlantInput,
    userId: string
): Promise<UserPlant> {
    const { data: previous, error: fetchError } = await supabase
        .from("plants")
        .select(
            "watering_interval, watering_unit, watering_enabled, pruning_interval, pruning_unit, pruning_enabled, fertilizer_interval, fertilizer_unit, fertilizer_enabled"
        )
        .eq("id", plantId)
        .eq("user_id", userId)
        .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
        .from("plants")
        .update({
            name: input.name,
            scientific_name: input.scientificName,
            icon: input.iconIndex,
            watering_interval: input.watering.enabled ? input.watering.interval : null,
            watering_unit: input.watering.enabled ? input.watering.unit : null,
            watering_enabled: input.watering.enabled,
            pruning_interval: input.pruning.enabled ? input.pruning.interval : null,
            pruning_unit: input.pruning.enabled ? input.pruning.unit : null,
            pruning_enabled: input.pruning.enabled,
            fertilizer_interval: input.fertilizing.enabled ? input.fertilizing.interval : null,
            fertilizer_unit: input.fertilizing.enabled ? input.fertilizing.unit : null,
            fertilizer_enabled: input.fertilizing.enabled,
        })
        .eq("id", plantId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) throw error;

    await syncAutomaticTasksAfterUpdate(plantId, userId, previous, input);

    return data;
}

/* Por cada tipo de tarea: si se desactivó, borra la pendiente; si se activó o cambió
   intervalo/unidad, borra la pendiente vieja y crea una nueva desde HOY; si no cambió, no toca nada */
async function syncAutomaticTasksAfterUpdate(
    plantId: string,
    userId: string,
    previous: any,
    input: UpdatePlantInput
) {
    const today = new Date();

    const types: [string, string, TaskFrequencyInput][] = [
        ["watering", "watering", input.watering],
        ["pruning", "pruning", input.pruning],
        ["fertilizing", "fertilizer", input.fertilizing],
    ];

    for (const [taskType, columnPrefix, freq] of types) {
        const wasEnabled = previous[`${columnPrefix}_enabled`];
        const prevInterval = previous[`${columnPrefix}_interval`];
        const prevUnit = previous[`${columnPrefix}_unit`];

        const changed = prevInterval !== freq.interval || prevUnit !== freq.unit;

        if (wasEnabled && !freq.enabled) {
            await supabase
                .from("plant_tasks")
                .delete()
                .eq("plant_id", plantId)
                .eq("user_id", userId)
                .eq("task_type", taskType)
                .eq("is_automatic", true)
                .eq("completed", false);
            continue;
        }

        if (freq.enabled && freq.interval && freq.unit && (!wasEnabled || changed)) {
            await supabase
                .from("plant_tasks")
                .delete()
                .eq("plant_id", plantId)
                .eq("user_id", userId)
                .eq("task_type", taskType)
                .eq("is_automatic", true)
                .eq("completed", false);

            await supabase.from("plant_tasks").insert({
                user_id: userId,
                plant_id: plantId,
                task_type: taskType,
                is_automatic: true,
                label: null,
                due_date: format(addInterval(today, freq.interval, freq.unit), "yyyy-MM-dd"),
                completed: false,
            });
        }
    }
}

export async function deletePlant(plantId: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from("plants")
        .update({ is_active: false })
        .eq("id", plantId)
        .eq("user_id", userId);

    if (error) throw error;
}