import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/* Popup de confirmación para acciones destructivas. Se renderiza solo cuando hace falta
   (el padre decide si mostrarlo), a diferencia de AlertModal que siempre está montado. */
export default function ConfirmModal({
    title,
    message,
    confirmLabel = "Borrar",
    cancelLabel = "Cancelar",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <div
            onClick={loading ? undefined : onCancel}
            className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-6"
            role="alertdialog"
            aria-modal="true"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-xl w-full max-w-xs p-6 text-center"
            >
                <div className="w-14 h-14 bg-[#fbe4e4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h2 className="text-base font-bold text-[#1e2d24] mb-1">{title}</h2>
                <p className="text-base font-bold text-[#FF0000] mb-5 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-3 rounded-full bg-[#f0f0ec] text-[#1e2d24] font-semibold text-sm hover:bg-[#e4e4dc] transition disabled:opacity-60"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-3 rounded-full bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition disabled:opacity-60"
                    >
                        {loading ? "Borrando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}