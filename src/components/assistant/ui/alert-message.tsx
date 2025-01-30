// alert-message.tsx
import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from "../../../lib/utils";

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert = React.forwardRef<
  HTMLDivElement,
  AlertProps
>(({ variant = 'info', title, children, onClose, className, ...props }, ref) => {
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800',
      icon: <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
      textColor: 'text-green-800 dark:text-green-200',
      titleColor: 'text-green-900 dark:text-green-100'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800',
      icon: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
      textColor: 'text-red-800 dark:text-red-200',
      titleColor: 'text-red-900 dark:text-red-100'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
      textColor: 'text-yellow-800 dark:text-yellow-200',
      titleColor: 'text-yellow-900 dark:text-yellow-100'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      icon: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      textColor: 'text-blue-800 dark:text-blue-200',
      titleColor: 'text-blue-900 dark:text-blue-100'
    }
  };

  const currentStyle = styles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-lg border p-4",
        currentStyle.bg,
        currentStyle.border,
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {currentStyle.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h3 className={cn("text-sm font-medium mb-1", currentStyle.titleColor)}>
              {title}
            </h3>
          )}
          <div className={cn("text-sm", currentStyle.textColor)}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  );
});

Alert.displayName = "Alert";

export { Alert };