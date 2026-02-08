import { useCallback, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastContext } from "./toast-context";

type ToastType = "success" | "error" | "warning";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

const TOAST_DURATION_MS = 3000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const success = useCallback(
    (message: string) => addToast(message, "success"),
    [addToast],
  );
  const error = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast],
  );
  const warning = useCallback(
    (message: string) => addToast(message, "warning"),
    [addToast],
  );

  return (
    <ToastContext.Provider value={{ success, error, warning }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notificações"
        className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              "pointer-events-auto flex min-w-[280px] max-w-md items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-opacity",
              toast.type === "success" &&
                "border-green-300 bg-green-100 text-green-800",
              toast.type === "error" &&
                "border-red-300 bg-red-100 text-red-800",
              toast.type === "warning" &&
                "border-amber-300 bg-amber-100 text-amber-800",
            )}
          >
            {toast.type === "success" && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200">
                <Check className="h-4 w-4 text-green-700" aria-hidden />
              </span>
            )}
            {toast.type === "warning" && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden />
              </span>
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
