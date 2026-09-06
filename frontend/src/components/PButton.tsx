import React from "react";

interface PButtonProps {
    label: string;
    onClick?: () => Promise<void>;
    loading?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
}

/* Botón reutilizable que muestra un estado de carga y evita acciones repetidas */
export default function PButton({loading, onClick, disabled, label}: PButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className="
        btn btn-primary
        bg-primarioClaro border-0 text-textoNegro
        hover:bg-fondoGlobal hover:border-0
        transition-all duration-300
        
      "
        >
            {loading ? "Cargando..." : label}
        </button>
    );
}