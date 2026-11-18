import { createContext, useContext, useEffect, useRef, useState } from "react";
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

    /* Id del usuario cuyo rol ya se cargó (o se está cargando). Evita pedir el mismo rol varias veces:
       Supabase emite INITIAL_SESSION al suscribirse y, más adelante, SIGNED_IN o TOKEN_REFRESHED
       (por ejemplo al volver a la pestaña), y todos esos eventos traen al mismo usuario */
    const roleLoadedFor = useRef<string | null>(null);

    /* Consulta el rol relacionado con el perfil del usuario actual */
    async function fetchRole(userId: string) {
        /* Se marca antes de la consulta para que un evento que llegue mientras tanto no repita la petición */
        roleLoadedFor.current = userId;

        const { data, error } = await supabase
            .from("profiles")
            .select("role_id, roles(name)")
            .eq("id", userId)
            .single();

        /* Si no se encuentra el perfil, se elimina el rol para evitar usar información anterior */
        if (error || !data) {
            /* Se libera la marca para que el próximo evento pueda reintentar */
            roleLoadedFor.current = null;
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
        /* Recupera la sesión guardada al iniciar la aplicación.
          Antes esto ponía loading=false de inmediato sin esperar el rol, que se
           consultaba aparte (más abajo, en onAuthStateChange) de forma asíncrona. Eso
           dejaba una ventana donde loading ya era false pero role todavía era null, y
           AdminRoute interpretaba eso como "no es admin" y mandaba al usuario a
           /my-plants antes de que el rol llegara. Por eso ahora se espera fetchRole aquí
           también antes de bajar loading. */
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchRole(session.user.id);
            } else {
                roleLoadedFor.current = null;
                setRole(null);
            }
            setLoading(false);
        });

        /* Escucha cambios de autenticación para actualizar los datos del contexto */
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                /* INITIAL_SESSION lo emite Supabase al suscribirse y getSession() (arriba)
                   ya se encarga de cargar la sesión y el rol, así que se ignora */
                if (event === "INITIAL_SESSION") return;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    /* Si el rol de este usuario ya está cargado (o en camino), no se consulta otra vez.
                       Quien lo está cargando es quien baja loading, por eso aquí no se toca */
                    if (roleLoadedFor.current !== session.user.id) {
                        await fetchRole(session.user.id);
                        setLoading(false);
                    }
                } else {
                    roleLoadedFor.current = null;
                    setRole(null);
                    setLoading(false);
                }

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