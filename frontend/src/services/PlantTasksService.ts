import { supabase } from "../lib/supabase";
import { addDays, addMonths, addWeeks, endOfMonth, format, startOfMonth } from "date-fns";
import type { TaskUnit } from "./UserPlantsService";

export type FixedTaskType = "watering" | "pruning" | "fertilizing";
export type TaskType = FixedTaskType | "custom";

export interface PlantTask {
    id: string;
    plant_id: string;
    plant_name: string;
    task_type: TaskType;
    is_automatic: boolean;
    label: string | null;
    due_date: string; // "yyyy-MM-dd"
    completed: boolean;
    notes?:string
}

export interface ManualTaskInput {
    plantId: string;
    taskType: TaskType;
    label: string | null;
    dueDate: string; // "yyyy-MM-dd"
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

/* Tareas (automáticas y manuales) del usuario cuya fecha cae entre "from" y "to"
   (ambas "yyyy-MM-dd", inclusive), solo de plantas activas. Es la consulta base:
   getPlantTasksForMonth y las secciones "Hoy"/"Próximas" de Mis Plantas la reusan
   cada una con su propio rango de fechas. */
export async function getPlantTasksInRange(userId: string, from: string, to: string): Promise<PlantTask[]> {
    const { data, error } = await supabase
        .from("plant_tasks")
        .select("id, plant_id, task_type, is_automatic, label, due_date, completed, plants!inner(name, is_active)")
        .eq("user_id", userId)
        .eq("plants.is_active", true)
        .gte("due_date", from)
        .lte("due_date", to);

    if (error) throw error;

    return (data ?? []).map((row: any) => ({
        id: row.id,
        plant_id: row.plant_id,
        plant_name: row.plants?.name ?? "",
        task_type: row.task_type,
        is_automatic: row.is_automatic,
        label: row.label,
        due_date: row.due_date,
        completed: row.completed,
    }));
}

/* Tareas (automáticas y manuales) del usuario cuya fecha cae dentro del mes visible,
   solo de plantas activas */
export async function getPlantTasksForMonth(userId: string, monthReference: Date): Promise<PlantTask[]> {
    const from = format(startOfMonth(monthReference), "yyyy-MM-dd");
    const to = format(endOfMonth(monthReference), "yyyy-MM-dd");
    return getPlantTasksInRange(userId, from, to);
}

/* Tareas personalizadas (creadas desde el Calendario) de una planta en particular,
   para mostrarlas en su ficha de detalle. Incluye completadas y pendientes. */
export async function getCustomTasksForPlant(userId: string, plantId: string): Promise<PlantTask[]> {
    const { data, error } = await supabase
        .from("plant_tasks")
        .select("id, plant_id, task_type, is_automatic, label, due_date, completed, plants!inner(name, is_active)")
        .eq("user_id", userId)
        .eq("plant_id", plantId)
        .eq("task_type", "custom")
        .order("due_date", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row: any) => ({
        id: row.id,
        plant_id: row.plant_id,
        plant_name: row.plants?.name ?? "",
        task_type: row.task_type,
        is_automatic: row.is_automatic,
        label: row.label,
        due_date: row.due_date,
        completed: row.completed,
    }));
}

export async function createManualTask(input: ManualTaskInput, userId: string) {
    const { data, error } = await supabase
        .from("plant_tasks")
        .insert({
            user_id: userId,
            plant_id: input.plantId,
            task_type: input.taskType,
            is_automatic: false,
            label: input.label,
            due_date: input.dueDate,
            completed: false,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/* Nunca toca tareas automáticas (filtro is_automatic = false como seguro extra) */
export async function updateManualTask(taskId: string, input: ManualTaskInput, userId: string) {
    const { data, error } = await supabase
        .from("plant_tasks")
        .update({
            plant_id: input.plantId,
            task_type: input.taskType,
            label: input.label,
            due_date: input.dueDate,
        })
        .eq("id", taskId)
        .eq("user_id", userId)
        .eq("is_automatic", false)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteManualTask(taskId: string, userId: string): Promise<void> {
    const { error } = await supabase
        .from("plant_tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", userId)
        .eq("is_automatic", false);

    if (error) throw error;
}

/* Marca completada/pendiente. Si es automática y se marca completada, genera la siguiente
   ocurrencia calculada desde la fecha ORIGINAL programada (no desde la fecha real de completado) */
export async function toggleTaskCompletion(taskId: string, userId: string, completed: boolean): Promise<void> {
    const { data: task, error: fetchError } = await supabase
        .from("plant_tasks")
        .select("id, plant_id, task_type, is_automatic, due_date, next_generated")
        .eq("id", taskId)
        .eq("user_id", userId)
        .single();

    if (fetchError) throw fetchError;

    if (!completed) {
        const { error: updateError } = await supabase
            .from("plant_tasks")
            .update({ completed: false, completed_at: null })
            .eq("id", taskId)
            .eq("user_id", userId);

        if (updateError) throw updateError;
        return;
    }

    /* Las tareas manuales no generan una siguiente ocurrencia: al completarse, se borran */
    if (!task.is_automatic) {
        const { error: deleteError } = await supabase
            .from("plant_tasks")
            .delete()
            .eq("id", taskId)
            .eq("user_id", userId);

        if (deleteError) throw deleteError;
        return;
    }

    /* El filtro .eq("completed", false) evita que dos clics casi simultáneos procesen
       la misma fila dos veces (protección contra condición de carrera) */
    const { data: updatedRows, error: updateError } = await supabase
        .from("plant_tasks")
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq("id", taskId)
        .eq("user_id", userId)
        .eq("completed", false)
        .select();

    if (updateError) throw updateError;
    if (!updatedRows || updatedRows.length === 0) return;

    /* Si esta tarea ya generó su siguiente ocurrencia antes (desmarcada y vuelta a marcar),
       no se genera otra vez */
    if (task.next_generated) return;

    const columnPrefix = task.task_type === "fertilizing" ? "fertilizer" : task.task_type;

    const { data: plant, error: plantError } = await supabase
        .from("plants")
        .select("*")
        .eq("id", task.plant_id)
        .single();

    if (plantError || !plant) return;

    const enabled = (plant as any)[`${columnPrefix}_enabled`];
    const interval = (plant as any)[`${columnPrefix}_interval`];
    const unit = (plant as any)[`${columnPrefix}_unit`] as TaskUnit | null;

    if (!plant.is_active || !enabled || !interval || !unit) return;

    const nextDueDate = addInterval(new Date(`${task.due_date}T00:00:00`), interval, unit);

    const { error: insertError } = await supabase.from("plant_tasks").insert({
        user_id: userId,
        plant_id: task.plant_id,
        task_type: task.task_type,
        is_automatic: true,
        label: null,
        due_date: format(nextDueDate, "yyyy-MM-dd"),
        completed: false,
    });

    if (insertError) throw insertError;

    /* Marca la tarea original para que no vuelva a generar otra si se desmarca/marca de nuevo */
    await supabase
        .from("plant_tasks")
        .update({ next_generated: true })
        .eq("id", taskId)
        .eq("user_id", userId);
}
