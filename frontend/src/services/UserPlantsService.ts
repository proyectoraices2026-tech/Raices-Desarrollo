import { supabase } from "../lib/supabase";

export interface NewPlantInput {
    name: string;
    scientificName: string;
    wateringFrequency: string;
    pruningFrequency: string;
    fertilizingFrequency: string;
    iconIndex: number | null;
}

export interface UserPlant {
    id: string;
    name: string;
    scientific_name: string | null;
    watering_frequency: string | null;
    pruning_frequency: string | null;
    fertilizer_frequency: string | null;
    icon: string | null;
}

export async function getUserPlants(userId: string): Promise<UserPlant[]> {
    const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function registerPlant(input: NewPlantInput, userId: string) {
    const { data, error } = await supabase
        .from("plants")
        .insert({
            user_id: userId,
            name: input.name,
            scientific_name: input.scientificName,
            watering_frequency: input.wateringFrequency,
            pruning_frequency: input.pruningFrequency,
            fertilizer_frequency: input.fertilizingFrequency,
            icon: input.iconIndex,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}