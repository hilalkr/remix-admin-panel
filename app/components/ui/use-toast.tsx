import * as React from "react";

interface ToastState {
  id: string;
  title?: string;
  description?: string;
  duration: number;
}

interface ToastContextValue {
  toast: (props: {
    title?: string;
    description?: string;
    duration?: number;
  }) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const toast = React.useCallback(
    ({
      title,
      description,
      duration = 5000,
    }: {
      title?: string;
      description?: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);

      const newToast: ToastState = {
        id,
        title,
        description,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-md bg-white p-4 shadow-md dark:bg-slate-800"
          >
            {t.title && (
              <div className="font-semibold text-slate-900 dark:text-slate-50">
                {t.title}
              </div>
            )}
            {t.description && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);
