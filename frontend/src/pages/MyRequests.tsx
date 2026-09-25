import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import { getMyRequests, archiveRequest } from "../services/RequestService";
import type { OrderRequest } from "../services/RequestService";
import { getActiveProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { useAlert } from "../context/AlertContext"

/* Traduce el estado que guarda el backend a algo que un usuario entienda,
   y a un color de acuerdo a si sigue pendiente, se aceptó o se rechazó */
const STATUS_LABEL: Record<OrderRequest["status"], string> = {
  pending: "Pendiente",
  accepted: "Aceptado",
  rejected: "Rechazado",
};

const STATUS_STYLE: Record<OrderRequest["status"], string> = {
  pending: "bg-[#fdf3d9] text-[#8a6d1d]",
  accepted: "bg-[#e3f0e5] text-[#2f6b3f]",
  rejected: "bg-[#fbe4e2] text-[#a13a32]",
};

/* Página privada: muestra los pedidos que el usuario ha hecho y su estado actual,
   incluyendo el mensaje que haya dejado el administrador al aceptar/rechazar */
export default function MyRequests() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  /* Los pedidos solo traen el id de cada producto, no su nombre ni imagen;
     por eso se cruzan con el catálogo para poder mostrar algo reconocible */
  const [productsById, setProductsById] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showAlert } = useAlert();

  const loadMyRequests = () => {
    setLoading(true);
    setError(null);
    getMyRequests()
      .then(setRequests)
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudieron cargar tus pedidos."))
      .finally(() => setLoading(false));
  };

  useEffect(loadMyRequests, []);

  const handleArchive = async (id: string) => {
    try {
      await archiveRequest(id);
      // recargar la lista, mismo patrón que loadPendingRequests
      loadMyRequests();
    } catch (err) {
      showAlert({
        title: "No se pudo eliminar el pedido",
        variant: "error",
        message: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
      });
    }
  };

  useEffect(() => {
    Promise.all([getMyRequests(), getActiveProducts()])
      .then(([myRequests, products]) => {
        setRequests(myRequests);
        setProductsById(Object.fromEntries(products.map((p) => [p.id, p])));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudieron cargar tus pedidos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f2] pb-28">
      <NavBar onMenuClick={() => setMenuOpen(true)} />

      <div className="md:max-w-3xl md:mx-auto px-5 py-6 md:px-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mb-2 text-[#3E5C4A] rounded-full hover:bg-[#4E705B]/10"
          aria-label="Volver"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
        </button>

        <h1 className="font-poppins text-2xl font-bold text-[#1e2d24] mb-5">Mis pedidos</h1>

        {loading && (
          <p className="text-sm text-[#537a63] animate-pulse">Cargando tus pedidos...</p>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-xl text-center">
            <p role="alert" className="text-xs font-semibold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-[#c8dcc2] flex flex-col items-center justify-center gap-2 py-12 px-6 text-center">
            <Package className="w-10 h-10 text-[#c8dcc2]" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-[#1e2d24]">No tienes ningún pedido en circulación</p>
            <p className="text-xs text-[#537a63] max-w-xs">
              Los pedidos que hagas desde el carrito van a aparecer aquí, junto con su estado.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
              {(request.status === "accepted" || request.status === "rejected") && (
                <button
                  onClick={() => handleArchive(request.id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              )}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[#537a63]">
                  {new Date(request.createdAt).toLocaleDateString("es-CR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <span className={`text-[11px] font-semibold rounded-full px-3 py-1 ${STATUS_STYLE[request.status]}`}>
                  {STATUS_LABEL[request.status]}
                </span>
              </div>

              <ul className="space-y-1.5 mb-3">
                {request.requestItems.map((item) => {
                  const product = productsById[item.productId];
                  return (
                    <li key={item.id} className="flex justify-between text-sm text-[#1e2d24]">
                      <span className="truncate pr-2">
                        {product?.name ?? "Producto ya no disponible"} × {item.quantity}
                      </span>
                      <span className="text-[#537a63] font-medium flex-shrink-0">
                        ${(Number(item.price) * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex justify-between items-center pt-2 border-t border-[#e8efe4]">
                <p className="text-xs font-medium text-[#537a63]">Total</p>
                <p className="text-sm font-bold text-[#1e2d24]">
                  ${Number(request.totalAmount).toLocaleString()}
                </p>
              </div>

              {request.adminMessage && (
                <div className="mt-3 bg-[#f5f7f2] rounded-xl p-3">
                  <p className="text-[11px] font-semibold text-[#537a63] mb-0.5">Mensaje del vivero</p>
                  <p className="text-xs text-[#1e2d24]">{request.adminMessage}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomNav />
    </div>
  );
}
