import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Lleva el scroll al inicio de la página cada vez que cambia la ruta */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
}