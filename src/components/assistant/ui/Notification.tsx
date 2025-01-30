// src/components/ui/Notification.tsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export default function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 min-w-[300px] flex items-start gap-3">
        {icons[type]}
        <p className="text-gray-200 flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
