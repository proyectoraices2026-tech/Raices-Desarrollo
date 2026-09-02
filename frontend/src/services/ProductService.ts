import { supabase } from "../lib/supabase";

/* Esquema del formato de producto para que pueda ser guardado en la base de datos */
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

/* 
    Esquema de creación de un nuevo producto, no son iguales dado que hay ciertos datos
    que son generados automáticamente por la base de datos o por logística son distintos
    como la imagen que dentro del código se tiene que subir un archivo, pero en la base de datos
    se guarda la url.
*/
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

/* 
    Obtener productos activos

    Esta función consulta en la base de datos únicamente por productos con el atributo is_active = true
    esto para llevar a cabo borrado lógico posterior o dar de baja un producto si por a o b razón se
    descontinúa
*/

/* Esta función va a consultar por productos por ende es un arreglo de productos */
export async function getActiveProducts(): Promise<Product[]> {

    /* 
        Se inicializan las const data (La informacion que viene desde la base de datos) 
        y error (Mensaje que aparece en casa de que la información no llegue)
    */
    const { data, error } = await supabase
        // Seleccionar tabla
        .from("products")
        // Consultar por todos los productos y todos sus atributos
        .select("*")
        // Que su atributo is_active = true
        .eq("is_active", true)
        // Se acomodan los resultados de forma desendente (Se especifica que de forma ascendente no)
        .order("created_at", { ascending: false });
    
    // Si ocurrió un error se imprime el mensaje
    if (error) throw error;
    // Devolver datos
    return data ?? [];
}

/* 
    Obtener categorias

    Esta función consulta en la base de datos por las categorias, esto para que sólo sean seleccionables
    en el formulario donde se creen los productos, las mismas categorias que se encuentran registradas
*/
export async function getCategories() {

    /* 
        Se inicializan las const data (La informacion que viene desde la base de datos) 
        y error (Mensaje que aparece en casa de que la información no llegue)
    */
    const { data, error } = await supabase
        // Seleccionar tabla
        .from("categories")
        // Consultar únicamente por el id y el nombre de la categoria
        .select("id, name")
        // Ordena los datos de forma alfabética
        .order("name");

    // Si ocurrió un error se imprime el mensaje
    if (error) throw error;
    // Devolver datos
    return data ?? [];
}

/* 
    Función de subir un producto

    Se van a extraer los datos introducidos por el usuario en el formulario para luego
    guardarlos en la base de datos
*/
/* 
    Input hace referencia a lo que le va a entrar por medio del formulario, lo cual está tipado
    como la intarfaz que se había creado con este fin, lo cual a su vez se tiene que hacer la
    equivalencia con Product pues lo que se le añada al NewProductInput, se le va a tener que
    asignar a Product para que se pueda usar la base de datos
*/
export async function createProduct(input: NewProductInput): Promise<Product> {
    
    /* Para asignarle el nombre a la imagen, se hace uso del atributo sku del producto y se le añade la fecha */
    const fileName = `${input.sku}-${Date.now()}.${input.imageFile.name.split(".").pop()}`;
    /* 
        Se inicializan las const data (La informacion que viene desde la base de datos) 
        y error (Mensaje que aparece en casa de que la información no llegue).

        await supabase.storage hace referencia la bucket que es el lugar donde se guardan las imágenes
    */
    const { data: uploadData, error: uploadError } = await supabase.storage
        // seleccionar el bucket donde se guardan las imagenes
        .from("product-images")

        // se actualiza el nombre dentro de la base de datos
        .upload(fileName, input.imageFile);

       // Si ocurrió un error se imprime el mensaje 
    if (uploadError) throw uploadError;

    // se extrae la url de la imagen en el bucket para ponersela al producto en la tabla
    const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path);

    // insertar la data en la tablar productos

    /* 
        Se inicializan las const data (La informacion que viene desde la base de datos) 
        y error (Mensaje que aparece en casa de que la información no llegue).
    */
    const { data, error } = await supabase
        // seleccionar tabla products
        .from("products")
        // insetar los datos en la tabla
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

    // Si ocurrió un error se imprime el mensaje 
    if (error) throw error;
    // Devolver datos
    return data;
}