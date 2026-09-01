import { supabase } from "../lib/supabase";

export interface Product {
    id: string;
    category_id: string;
    sku: string;
    name: string;
    description: string | null;
    image_url: string | null;
    price: number;
    stock: number;
    min_stock: number;
    is_active: boolean;
}

export interface NewProductInput {
    category_id: string;
    sku: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    min_stock: number;
    imageFile: File;
}

export async function getActiveProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

    if (error) throw error;
    return data ?? [];
}

export async function createProduct(input: NewProductInput): Promise<Product> {
    // 1. Subir imagen
    const fileName = `${input.sku}-${Date.now()}.${input.imageFile.name.split(".").pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, input.imageFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path);

    // 2. Insertar producto
    const { data, error } = await supabase
        .from("products")
        .insert({
            category_id: input.category_id,
            sku: input.sku,
            name: input.name,
            description: input.description ?? null,
            image_url: publicUrl,
            price: input.price,
            stock: input.stock,
            min_stock: input.min_stock,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}