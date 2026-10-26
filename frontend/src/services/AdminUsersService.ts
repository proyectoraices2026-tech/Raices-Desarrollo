// src/services/AdminUsersService.ts

import { supabase } from "../lib/supabase";

export interface FoundUser {
    id: string;
    email: string;
    name: string | null;
}

/* Busca usuarios por email con la función de Postgres admin_find_users_by_email, porque
   auth.users no se puede leer desde el cliente. La función valida que quien llama sea admin. */
export async function findUsersByEmail(query: string): Promise<FoundUser[]> {
    const { data, error } = await supabase.rpc("admin_find_users_by_email", { p_query: query });

    if (error) throw error;
    return data ?? [];
}