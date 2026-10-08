import { supabase } from "../lib/supabase";

/*
    URL base del backend dedicado de pedidos (el de Ricardo, Node/Express en Railway).
    Se lee de la variable de entorno VITE_API_URL, que hay que definir en el .env del
    frontend (y en las variables de entorno de donde se despliegue el frontend, ej. Vercel):

        VITE_API_URL=https://tu-url-de-railway.up.railway.app

    Mientras se prueba en la máquina local, puede apuntar a http://localhost:3000
*/
const API_URL = import.meta.env.VITE_API_URL;

/* Un producto dentro de un pedido, tal como lo guarda el backend (no trae nombre/imagen,
   solo el id del producto, la cantidad y el precio congelado al momento de pedirlo) */
export interface RequestItem {
    id: string;
    requestId: string;
    productId: string;
    quantity: number;
    price: string;
    createdAt: string;
    updatedAt: string;
}

/* Un pedido completo, con sus items */
export interface OrderRequest {
    id: string;
    userId: string;
    status: "pending" | "accepted" | "rejected";
    adminMessage: string | null;
    totalAmount: string;
    createdAt: string;
    updatedAt: string;
    requestItems: RequestItem[];
}

/* Lo mínimo que el backend necesita para crear un pedido: el id de cada producto y su cantidad */
export interface NewRequestItemInput {
    productId: string;
    quantity: number;
}


async function getAuthHeader(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error("Debes iniciar sesión para hacer esto.");
    }

    return { Authorization: `Bearer ${session.access_token}` };
}

/* Convierte la respuesta del backend en un error legible, o la deja pasar si todo salió bien */
async function parseResponse<T>(res: Response): Promise<T> {
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message = data?.error || data?.message || "Ocurrió un error inesperado con el pedido.";
        throw new Error(message);
    }

    return data.data as T;
}

/*
    Crea un pedido nuevo a partir de los productos del carrito.
    POST /api/requests/request
*/
export async function createOrderRequest(items: NewRequestItemInput[]): Promise<OrderRequest> {
    const headers = await getAuthHeader();

    const res = await fetch(`${API_URL}/api/requests/request`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify({ items }),
    });

    return parseResponse<OrderRequest>(res);
}

/*
    Trae todos los pedidos del usuario actual (cualquier estado), para la pantalla "Mis pedidos".
    GET /api/requests/my-requests
*/
export async function getMyRequests(): Promise<OrderRequest[]> {
    const headers = await getAuthHeader();

    const res = await fetch(`${API_URL}/api/requests/my-requests`, {
        headers,
    });

    return parseResponse<OrderRequest[]>(res);
}

/*
    Trae todos los pedidos pendientes de aprobar, para la pantalla de administración.
    GET /api/requests/pending
*/
export async function getPendingRequests(): Promise<OrderRequest[]> {
    const headers = await getAuthHeader();

    const res = await fetch(`${API_URL}/api/requests/pending`, {
        headers,
    });

    return parseResponse<OrderRequest[]>(res);
}

/*
    Acepta un pedido pendiente: descuenta el stock real y libera la reserva.
    POST /api/requests/:id/accept
*/
export async function acceptRequest(id: string, adminMessage?: string): Promise<OrderRequest> {
    const headers = await getAuthHeader();

    const res = await fetch(`${API_URL}/api/requests/${id}/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify({ adminMessage }),
    });

    return parseResponse<OrderRequest>(res);
}

/*
    Rechaza un pedido pendiente: libera la reserva de stock sin descontarlo
    POST /api/requests/:id/reject
*/
export async function rejectRequest(id: string, reason: string): Promise<OrderRequest> {
    const headers = await getAuthHeader();

    const res = await fetch(`${API_URL}/api/requests/${id}/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: JSON.stringify({ reason }),
    });

    return parseResponse<OrderRequest>(res);
}

export async function archiveRequest(id: string): Promise<OrderRequest> {
    const headers = await getAuthHeader();

    const res = await fetch(`${API_URL}/api/requests/${id}/archive`, {
        method: "PATCH",
        headers,
    });

    return parseResponse<OrderRequest>(res);
}



