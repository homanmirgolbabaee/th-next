import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const Alert = ({ type = 'info', title, children, onClose }: AlertProps) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      textColor: 'text-green-800',
      titleColor: 'text-green-900'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      textColor: 'text-red-800',
      titleColor: 'text-red-900'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      textColor: 'text-yellow-800',
      titleColor: 'text-yellow-900'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      textColor: 'text-blue-800',
      titleColor: 'text-blue-900'
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`rounded-lg p-4 ${currentStyle.bg} border ${currentStyle.border}`}>
      <div className="flex">
        <div className="flex-shrink-0">{currentStyle.icon}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${currentStyle.titleColor}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${currentStyle.textColor} mt-1`}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto pl-3 -my-1.5 -mr-1.5"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

// Usage examples:
export const AlertDemo = () => {
  return (
    <div className="space-y-4">
      <Alert type="success" title="Success">
        Operation completed successfully!
      </Alert>
      
      <Alert type="error" title="Error" onClose={() => console.log('closed')}>
        Something went wrong. Please try again.
      </Alert>
      
      <Alert type="warning">
        Your session will expire in 5 minutes.
      </Alert>
      
      <Alert type="info" title="Information">
        A new version is available.
      </Alert>
    </div>
  );
};