import React from 'react';

const typeStyles = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
};

const ToastViewport = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[1200] flex w-[min(92vw,380px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-sm border px-3 py-3 text-xs font-bold tracking-wide shadow-md ${typeStyles[toast.type] || typeStyles.info}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-current/70 transition-colors hover:text-current"
              aria-label="Dismiss notification"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;
