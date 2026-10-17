import { useEffect, useState } from "react";

/* Devuelve true mientras la pantalla cumpla la media query, por ejemplo "(max-width: 639px)".
   Se actualiza sola si cambia el tamaño de la ventana o se gira el celular. */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(
        () => typeof window !== "undefined" && window.matchMedia(query).matches
    );

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

        setMatches(mql.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, [query]);

    return matches;
}