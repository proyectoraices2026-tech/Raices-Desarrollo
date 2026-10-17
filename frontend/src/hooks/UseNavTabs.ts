import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

import calendarIcon from "../assets/iconsPhone/calendar.svg";
import plantsIcon from "../assets/iconsPhone/seedling.svg";
import catalogIcon from "../assets/iconsPhone/cart.svg";
import chatIcon from "../assets/iconsPhone/robot.svg";

export interface NavTab  {
    key: string;
    label: string;
    icon: string;
    path: string | null;
}

/* Tabs de navegación y su comportamiento, compartidos entre el header (escritorio) y el footer (mobile) */
export function useNavTabs() {
    const { role } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const tabs: NavTab[] = [
        { key: "catalog", label: "Inicio", icon: catalogIcon, path: "/" },
        ...(role === "admin"
            ? [{ key: "dashboard", label: "Dashboard", icon: calendarIcon, path: "/admin/stats" }]
            : [{ key: "my-plants", label: "Mis plantas", icon: plantsIcon, path: "/my-plants" }]), 
        ...(role === "admin"
            ? [{ key: "requests", label: "Gestión pedidos", icon: calendarIcon, path: "/admin/requests" }]
            : [{ key: "calendar", label: "Calendario", icon: calendarIcon, path: "/calendar" }]
        ),
        ...(role === "admin"
            ? [{ key: "products", label: "Gestión productos", icon: calendarIcon, path: "/admin/products/new" }]
            : [{ key: "chatbot", label: "Chatbot", icon: chatIcon, path: null }]
        )
    ];

    const handleClick = (path: string | null) => {
        if (!path) {
            showAlert({ title: "Próximamente", message: "Esta sección todavía no está disponible.", variant: "info" });
            return;
        }
        navigate(path);
    };

    const isActive = (tab: NavTab) => tab.path === location.pathname;

    return { tabs, handleClick, isActive };
}