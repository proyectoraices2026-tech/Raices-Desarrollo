import { supabase } from "../lib/supabase";

/*
    Los errores que lanza Supabase (por ejemplo cuando una política de RLS bloquea algo)
    son objetos planos con un campo "message", no instancias de la clase Error de JS.
    Por eso "err instanceof Error" les falla y se pierde el mensaje real. Esta función
    lee el mensaje sin importar cuál de los dos casos sea, para no mostrar nunca un
    "Error inesperado" genérico si Supabase sí mandó una razón concreta.
*/
export function getErrorMessage(err: unknown, fallback = "Ocurrió un error inesperado."): string {
    if (err instanceof Error) return err.message;
    if (err && typeof err === "object" && "message" in err) {
        return String((err as { message: unknown }).message);
    }
    return fallback;
}

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
    /* Nombre de la categoría, traído por la relación con la tabla `categories`
       (category_id es solo el uuid; esto es lo que se muestra en pantalla) */
    categories: { name: string } | null;
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
        // Consultar por todos los productos y todos sus atributos, más el nombre
        // de la categoría relacionada (category_id -> categories.name)
        .select("*, categories(name)")
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

/*
    Obtener todos los productos (activos e inactivos), para la pantalla de administración

    A diferencia de getActiveProducts, esta sí trae los productos dados de baja, para que
    el admin pueda verlos en la lista y reactivarlos si fue un error.
*/
export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

/*
    Esquema para editar un producto existente. Todos los campos son opcionales porque
    se puede editar solo uno (ej. solo el precio) sin tener que reenviar todo el resto.
    imageFile también es opcional: si no se manda, el producto se queda con la imagen que ya tenía.
*/
export interface UpdateProductInput {
    category_id?: string;
    sku?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    min_stock?: number;
    imageFile?: File;
}

/*
    Editar un producto ya existente

    Sigue el mismo patrón que createProduct: si viene una imagen nueva, primero se sube
    al bucket y se reemplaza la url; si no viene, se deja la imagen tal como estaba.
*/
export async function updateProduct(id: string, input: UpdateProductInput): Promise<void> {

    /* Se separa imageFile del resto porque ese campo no existe como columna en la tabla,
       solo se usa para subir el archivo y calcular image_url */
    const { imageFile, ...fieldsToUpdate } = input;

    /* Si se mandó una imagen nueva, se sube igual que en createProduct y se agrega su url */
    if (imageFile) {
        const fileName = `${input.sku ?? id}-${Date.now()}.${imageFile.name.split(".").pop()}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(uploadData.path);

        (fieldsToUpdate as Record<string, unknown>).image_url = publicUrl;
    }

    /*
        Ojo: aquí a propósito NO se encadena .select() después de .update(). Pedir de
        vuelta la fila recién editada se filtra por la policy de LECTURA (products_select_all,
        que solo deja ver productos con is_active = true), no por la de escritura — así
        que si el producto que se está editando está desactivado, Supabase lo bloquea con
        un falso error de RLS aunque la edición en sí sí esté permitida. Como quien llama
        a esta función (EditProductModal.tsx) nunca usa el producto que devuelve, ni falta
        que le pidamos.
    */
    const { error } = await supabase
        .from("products")
        .update(fieldsToUpdate)
        .eq("id", id);

    if (error) throw error;
}

/*
    Activar o desactivar un producto (borrado lógico)

    "Eliminar" un producto en realidad lo desactiva (is_active = false) en vez de borrar
    la fila de la base de datos. Esto es a propósito: si el producto ya tiene pedidos
    hechos, la tabla request_items todavía apunta a su id, así que borrarlo de verdad
    rompería el historial de esos pedidos. getActiveProducts() ya solo trae productos
    activos, así que uno desactivado desaparece de la tienda automáticamente.
*/
export async function setProductActive(id: string, isActive: boolean): Promise<void> {
    /* Mismo motivo que en updateProduct: sin .select() después de .update(), para no
       chocar con la policy de lectura al desactivar un producto (deja de cumplir
       is_active = true justo en la misma operación que lo cambia). */
    const { error } = await supabase
        .from("products")
        .update({ is_active: isActive })
        .eq("id", id);

    if (error) throw error;
}