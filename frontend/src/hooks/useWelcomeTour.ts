import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

/* Rutas donde puede arrancar el tour (deben mostrar el header con los elementos marcados con data-tour) */
const TOUR_ROUTES = ["/"];

/* Decide si se muestra el tour de bienvenida: solo usuarios regulares que aún no lo han visto */
export function useWelcomeTour() {
    const { user, role, loading } = useAuth();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const checkedUserId = useRef<string | null>(null);

    useEffect(() => {
        if (loading || !user || !role || role === "admin") return;
        if (!TOUR_ROUTES.includes(pathname)) return;
        /* Solo se consulta una vez por usuario en esta sesión de la app */
        if (checkedUserId.current === user.id) return;
        checkedUserId.current = user.id;

        (async () => {
            /* getUser consulta al servidor: evita usar metadatos viejos guardados en el token */
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) return;
            if (data.user.user_metadata?.tour_seen === true) return;

            setOpen(true);

            /* Se marca como visto desde que arranca: omitirlo o cerrarlo a la mitad cuenta como visto */
            const { error: updateError } = await supabase.auth.updateUser({
                data: { tour_seen: true },
            });
            if (updateError) console.error("No se pudo guardar tour_seen:", updateError);
        })();
    }, [loading, user, role, pathname]);

    const close = useCallback(() => setOpen(false), []);

    return { open, close };
}