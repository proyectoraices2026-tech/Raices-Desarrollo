import { ProductList } from "../components/ProductList";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PButton from "../components/PButton";

/* Página privada que muestra el catálogo y las acciones disponibles para el rol */
export default function Catalog() {

    const navigate = useNavigate();
    const { role } = useAuth();
    console.log("role actual:", role);
    const [loading, setLoading] = useState(false);

    /* Envía al administrador al formulario para añadir productos */
    const handleAddProduct = async () => {
        navigate("/admin/products/new");
    };

    return (
        <div>
            <h1>Catálogo</h1>
            <ProductList />

            {/* El botón de alta solo se muestra a usuarios con rol administrador */}
            {role === "admin" &&
                <PButton
                    onClick={handleAddProduct}
                    disabled={loading}
                    label="Añadir"
                >
                    {loading ? <span className="loading loading-spinner" /> : "Añadir"}
                </PButton>
            }
        </div>
    );
}