import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-70">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-slide bg-black text-white px-4 py-3 rounded-lg shadow-lg"
        >
          {toast.message}

          {/* Progress bar */}
          <div className="mt-2 w-full bg-gray-700 h-1 rounded">
            <div
              className="h-1 bg-[#e68946] rounded"
              style={{
                width: `${toast.progress}%`,
                transition: "width 50ms linear",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
