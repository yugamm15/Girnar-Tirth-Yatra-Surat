import React from 'react';

const ConfirmModal = ({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="absolute inset-0 bg-black/55" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-sm border border-gray-200 bg-white p-6 shadow-2xl">
        <h3 id="confirm-modal-title" className="text-lg font-headline text-gray-900">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-600 transition-colors hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#c5a059] hover:bg-[#b08d4a]'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
