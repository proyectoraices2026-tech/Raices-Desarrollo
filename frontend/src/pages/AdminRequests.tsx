import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAlert } from "../context/AlertContext";
import { getPendingRequests, acceptRequest, rejectRequest } from "../services/RequestService";
import type { OrderRequest } from "../services/RequestService";
import { getActiveProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";

/* Nombre del cliente que hizo el pedido. Solo trae id y name, igual que en
   UpdateUser.tsx, para poder mostrar "quién pidió" en vez de solo el uuid. */
interface RequesterProfile {
    id: string;
    name: string | null;
}

/* Página administrativa para aprobar o rechazar los pedidos pendientes.
   Corresponde a los endpoints /api/requests/pending, /accept y /reject
   del backend dedicado de pedidos (mismo backend que usa MyRequests.tsx). */
export default function AdminRequests() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [requests, setRequests] = useState<OrderRequest[]>([]);
    /* Los pedidos solo traen el id de cada producto y el id del usuario que pidió;
       por eso se cruzan con el catálogo y con los perfiles para mostrar algo reconocible */
    const [productsById, setProductsById] = useState<Record<string, Product>>({});
    const [profilesById, setProfilesById] = useState<Record<string, RequesterProfile>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    /* Evita que se pueda hacer doble clic en aceptar/rechazar del mismo pedido mientras responde el backend */
    const [processingId, setProcessingId] = useState<string | null>(null);
    /* Id del pedido que se está por rechazar; controla si se muestra el cuadro para escribir el motivo */
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [acceptMessage, setAcceptMessage] = useState("");

    const loadPendingRequests = () => {
        setLoading(true);
        setError(null);

        Promise.all([getPendingRequests(), getActiveProducts()])
            .then(async ([pending, products]) => {
                setRequests(pending);
                setProductsById(Object.fromEntries(products.map((p) => [p.id, p])));

                /* Trae de una vez el nombre de todos los clientes que aparecen en los pedidos pendientes */
                const userIds = [...new Set(pending.map((r) => r.userId))];
                if (userIds.length > 0) {
                    const { data } = await supabase
                        .from("profiles")
                        .select("id, name")
                        .in("id", userIds);
                    if (data) {
                        setProfilesById(Object.fromEntries(data.map((p) => [p.id, p])));
                    }
                }
            })
            .catch((err) => setError(err instanceof Error ? err.message : "No se pudieron cargar los pedidos pendientes."))
            .finally(() => setLoading(false));
    };

    useEffect(loadPendingRequests, []);

    const handleAccept = async () => {
        if (!acceptingId) return;

        setProcessingId(acceptingId);
        try {
            await acceptRequest(acceptingId, acceptMessage.trim() || undefined);
            showAlert({ title: "Pedido aceptado", message: "Se descontó el stock y el cliente ya puede ver tu mensaje.", variant: "success" });
            setAcceptingId(null);
            setAcceptMessage("");
            loadPendingRequests();
        } catch (err) {
            showAlert({
                title: "No se pudo aceptar el pedido",
                message: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
                variant: "error",
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectingId) return;

        if (!rejectReason.trim()) {
            showAlert({ title: "Falta el motivo", message: "Escribe el motivo del rechazo antes de continuar.", variant: "error" });
            return;
        }

        setProcessingId(rejectingId);
        try {
            await rejectRequest(rejectingId, rejectReason.trim());
            showAlert({ title: "Pedido rechazado", message: "Se liberó el stock reservado de ese pedido.", variant: "success" });
            setRejectingId(null);
            setRejectReason("");
            loadPendingRequests();
        } catch (err) {
            showAlert({
                title: "No se pudo rechazar el pedido",
                message: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
                variant: "error",
            });
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F3] pb-28">
            <NavBar onMenuClick={() => setMenuOpen(true)} />

            <main className="p-4 sm:p-6 max-w-2xl mx-auto">
                {loading && (
                    <p className="text-sm text-[#537a63] text-center py-10 animate-pulse">Cargando pedidos...</p>
                )}

                {error && (
                    <div className="bg-red-50 p-4 rounded-xl text-center">
                        <p role="alert" className="text-xs font-semibold text-red-600">{error}</p>
                    </div>
                )}

                {!loading && !error && requests.length === 0 && (
                    <div className="bg-white rounded-2xl border border-dashed border-[#c8dcc2] flex flex-col items-center justify-center gap-2 py-12 px-6 text-center">
                        <Package className="w-10 h-10 text-[#c8dcc2]" strokeWidth={1.5} />
                        <p className="text-sm font-semibold text-[#1e2d24]">No hay pedidos pendientes por revisar</p>
                    </div>
                )}

                <div className="space-y-4">
                    {requests.map((request) => {
                        const requester = profilesById[request.userId];
                        const isProcessing = processingId === request.id;

                        return (
                            <div key={request.id} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1e2d24]">
                                            {requester?.name || "Cliente sin nombre registrado"}
                                        </p>
                                        <p className="text-xs text-[#537a63]">
                                            {new Date(request.createdAt).toLocaleDateString("es-CR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <span className="text-[11px] font-semibold rounded-full px-3 py-1 bg-[#fdf3d9] text-[#8a6d1d]">
                                        Pendiente
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

                                <div className="flex justify-between items-center pt-2 pb-3 border-t border-[#e8efe4]">
                                    <p className="text-xs font-medium text-[#537a63]">Total</p>
                                    <p className="text-sm font-bold text-[#1e2d24]">
                                        ${Number(request.totalAmount).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setAcceptingId(request.id);
                                            setAcceptMessage("");
                                        }}
                                        disabled={isProcessing}
                                        className="flex-1 py-2.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition disabled:opacity-50"
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRejectingId(request.id);
                                            setRejectReason("");
                                        }}
                                        disabled={isProcessing}
                                        className="flex-1 py-2.5 rounded-full bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition disabled:opacity-50"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Cuadro para escribir el motivo de rechazo, antes de mandarlo al backend
                (el backend lo exige, así que se pide aquí mismo en vez de rechazar sin motivo) */}
            {rejectingId && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50"
                    onClick={() => setRejectingId(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-base font-bold text-[#1e2d24] mb-1">Motivo del rechazo</h2>
                        <p className="text-xs text-[#537a63] mb-4">
                            El cliente va a ver este mensaje en "Mis pedidos".
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={3}
                            placeholder="Ej. No hay suficiente stock de una de las plantas."
                            className="w-full border border-[#dcdcd4] rounded-xl p-3 text-sm text-[#1e2d24] mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E705B]/40"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setRejectingId(null)}
                                className="flex-1 py-2.5 rounded-full bg-[#f0f0ec] text-[#1e2d24] font-semibold text-sm hover:bg-[#e4e4dc] transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                disabled={processingId === rejectingId}
                                className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {processingId === rejectingId ? "Rechazando..." : "Confirmar rechazo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {acceptingId && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50"
                    onClick={() => setAcceptingId(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-base font-bold text-[#1e2d24] mb-1">Mensaje para el cliente</h2>
                        <p className="text-xs text-[#537a63] mb-4">
                            El cliente va a ver este mensaje en "Mis pedidos". Cuéntale cuándo puede pasar a recogerlo.
                        </p>
                        <textarea
                            value={acceptMessage}
                            onChange={(e) => setAcceptMessage(e.target.value)}
                            rows={3}
                            placeholder="Ej. Tu pedido estará listo el 25 de agosto para que pases a recogerlo."
                            className="w-full border border-[#dcdcd4] rounded-xl p-3 text-sm text-[#1e2d24] mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E705B]/40"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setAcceptingId(null)}
                                className="flex-1 py-2.5 rounded-full bg-[#f0f0ec] text-[#1e2d24] font-semibold text-sm hover:bg-[#e4e4dc] transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={processingId === acceptingId}
                                className="flex-1 py-2.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition disabled:opacity-50"
                            >
                                {processingId === acceptingId ? "Aceptando..." : "Confirmar aceptación"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Panel lateral y barra inferior, visibles en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            <BottomNav />
        </div>
    );
}
