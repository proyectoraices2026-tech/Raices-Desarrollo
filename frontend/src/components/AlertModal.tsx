import { Check, X, Info } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  variant: "success" | "error" | "info";
  confirmLabel?: string;
}

const VARIANT_STYLES = {
  success: { bg: "bg-[#e3f3e9]", icon: Check, iconColor: "text-[#3E5C4A]" },
  error: { bg: "bg-[#fbe4e4]", icon: X, iconColor: "text-red-600" },
  info: { bg: "bg-[#e3f3e9]", icon: Info, iconColor: "text-[#3E5C4A]" },
};

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  variant,
  confirmLabel = "Aceptar",
}: AlertModalProps) {
  const { bg, icon: Icon, iconColor } = VARIANT_STYLES[variant];

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-6 transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl shadow-xl w-full max-w-xs p-6 text-center transition-transform duration-200 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <h2 className="text-base font-bold text-[#1e2d24] mb-1">{title}</h2>
        {message && (
          <p className="text-xs text-[#537a63] mb-5 leading-relaxed">{message}</p>
        )}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}