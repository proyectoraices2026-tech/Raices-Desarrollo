import { useEffect, useState } from "react";
import { getFinancialSummary } from "../services/StatsService";
import type { FinancialBucket, StatsRange } from "../services/StatsService";
import { getErrorMessage } from "../services/ProductService";

/* Trae el resumen financiero del período elegido. Lo usan la tarjeta numérica y el gráfico de ganancias. */
export function useFinancialSummary(range: StatsRange) {
    const [buckets, setBuckets] = useState<FinancialBucket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /* Evita que una respuesta lenta pise a la del período que se eligió después */
        let cancelled = false;
        setLoading(true);
        setError(null);
        setBuckets([]);

        getFinancialSummary(range)
            .then((data) => {
                if (!cancelled) setBuckets(data);
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err, "No se pudo cargar el resumen financiero."));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [range]);

    return { buckets, loading, error };
}