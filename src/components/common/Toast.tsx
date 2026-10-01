import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3 bg-white border border-[#DFE1E6] rounded-lg shadow-sm text-sm text-[#1F2937] transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />}
            {isWarning && <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && <Info className="w-4 h-4 text-[#475569] shrink-0 mt-0.5" />}
            
            <span className="flex-1 text-xs leading-relaxed">{toast.message}</span>
            
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#9CA3AF] hover:text-[#1F2937] transition-colors p-0.5"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
