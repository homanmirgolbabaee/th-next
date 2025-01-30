'use client';

import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className={`
        relative w-full max-w-lg mx-4 p-6 rounded-lg shadow-xl animate-fade-in
        ${isCyberpunk
          ? 'bg-black border-2 border-[#00ff00]/30'
          : 'bg-gray-900 border border-gray-700/50'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-gray-100'}`}>
            {isCyberpunk ? `[${title.toUpperCase()}]` : title}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors
              ${isCyberpunk
                ? 'hover:bg-[#001100] text-[#00ff00]'
                : 'hover:bg-gray-800 text-gray-400 hover:text-gray-100'}
            `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className={isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-gray-300'}>
          {children}
        </div>
      </div>
    </div>
  );
}