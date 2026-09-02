import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/* Esquema de los datos de autenticación que estarán disponibles en toda la aplicación */
interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    role: null,
    loading: true,
});

/* Proveedor que obtiene y mantiene actualizada la sesión y el rol del usuario */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    /* Consulta el rol relacionado con el perfil del usuario actual */
    async function fetchRole(userId: string) {
        const { data, error } = await supabase
            .from("profiles")
            .select("role_id, roles(name)")
            .eq("id", userId)
            .single();

            console.log("fetchRole data:", data, "error:", error);

        /* Si no se encuentra el perfil, se elimina el rol para evitar usar información anterior */
        if (error || !data) {
            setRole(null);
            return;
        }

        /* roles(name) viene como objeto por el join y de ahí se extrae el nombre */
        setRole((data.roles as unknown as { name: string })?.name ?? null);
    }

    useEffect(() => {
        /* Limpia hashes que no correspondan al flujo de recuperación de contraseña */
        if (window.location.hash && !window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname);
        }
        /* Recupera la sesión guardada al iniciar la aplicación */
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        /* Escucha cambios de autenticación para actualizar los datos del contexto */
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchRole(session.user.id);
                } else {
                    setRole(null);
                }
                setLoading(false);

                /* Envía al usuario al formulario cuando inicia una recuperación */
                if (event === "PASSWORD_RECOVERY") {
                    window.location.href = "/reset-password";
                }
            }
        );

        /* Cancela la suscripción cuando el proveedor deja de existir */
        return () => subscription.unsubscribe();
    }, []);

    /* Hace que la sesión y el rol estén disponibles para los componentes hijos */
    return (
        <AuthContext.Provider value={{ user, session, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);