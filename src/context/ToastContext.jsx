import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message, progress: 100 }
    ]);

    // Progress timer
    const duration = 2000;
    const intervalMs = 50;
    const step = 100 / (duration / intervalMs);

    const interval = setInterval(() => {
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, progress: t.progress - step }
            : t
        )
      );
    }, intervalMs);

    // Auto remove
    setTimeout(() => {
      clearInterval(interval);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
