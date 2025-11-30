import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="w-8 h-8 border-4 border-[#f4ffb8] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white/60 dark:bg-[#f4ffb8]/30 backdrop-blur-lg border border-gray-200 dark:border-[#f4ffb8] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-[#f4ffb8]/50 transition-colors duration-300 hover:border-gray-300 dark:hover:border-[#f4ffb8] ${className}`}>
    {children}
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-100 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300 dark:border-[#f4ffb8] rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 [transform-style:preserve-3d] animate-modal-pop-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-[#f4ffb8] dark:text-[#f4ffb8]">{title}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes modal-pop-in {
          from { opacity: 0; transform: scale(0.9) rotateX(-20deg); }
          to { opacity: 1; transform: scale(1) rotateX(0deg); }
        }
        .animate-modal-pop-in { animation: modal-pop-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};