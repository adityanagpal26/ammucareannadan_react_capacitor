import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: ReactNode;
  cancelText?: string;
  confirmText?: string;
  icon?: ReactNode;
}

const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Alert',
  message,
  cancelText = 'Cancel',
  confirmText = 'Continue',
  icon = <AlertTriangle className="w-6 h-6 text-amber-500" />
}: AlertDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="text-gray-700">{message}</div>
        </div>
        <div className="flex border-t border-gray-200">
          <button
            className="flex-1 py-3 px-4 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="flex-1 py-3 px-4 text-primary-600 font-medium hover:bg-primary-50 transition-colors border-l border-gray-200"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;