import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import AlertModal from "../components/AlertModal";

type AlertVariant = "success" | "error" | "info";

interface AlertOptions {
  title: string;
  message?: string;
  variant?: AlertVariant;
  confirmLabel?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showAlert = (options: AlertOptions) => {
    setAlertOptions(options);
    setIsOpen(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={alertOptions?.title ?? ""}
        message={alertOptions?.message}
        variant={alertOptions?.variant ?? "info"}
        confirmLabel={alertOptions?.confirmLabel}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert debe usarse dentro de <AlertProvider>");
  return ctx;
}