import { useEffect, useState } from "react";
import { getTopSellers } from "../services/StatsService";
import type { StatsRange, TopSeller } from "../services/StatsService";
import { getErrorMessage } from "../services/ProductService";

/* Trae los más vendidos del período elegido, para la dona y el panel de "Más vendidos" */
export function useTopSellers(range: StatsRange, limit = 6) {
    const [sellers, setSellers] = useState<TopSeller[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /* Evita que una respuesta lenta pise a la del período que se eligió después */
        let cancelled = false;
        setLoading(true);
        setError(null);
        setSellers([]);

        getTopSellers(range, limit)
            .then((data) => {
                if (!cancelled) setSellers(data);
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err, "No se pudieron cargar los más vendidos."));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [range, limit]);

    return { sellers, loading, error };
}