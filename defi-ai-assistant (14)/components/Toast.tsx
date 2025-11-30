
import React, { useState, useEffect } from 'react';
import { BellIcon, XMarkIcon } from './Icons';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300); // Wait for exit animation
  };

  return (
    <div
      className={`max-w-sm w-full bg-slate-800/80 backdrop-blur-lg shadow-lg rounded-xl pointer-events-auto ring-1 ring-[#f4ffb8]/50 overflow-hidden transition-all duration-300 transform ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <BellIcon className="h-6 w-6 text-[#f4ffb8]" aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-white">{toast.title}</p>
            <p className="mt-1 text-sm text-gray-300">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-white focus:outline-none"
              onClick={handleDismiss}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  );
};
