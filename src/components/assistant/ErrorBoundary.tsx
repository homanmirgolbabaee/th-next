'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorDisplay({ error, onReset }: ErrorDisplayProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';

  return (
    <div className={`
      flex flex-col items-center justify-center min-h-[400px] p-8 rounded-lg
      ${isCyberpunk
        ? 'bg-black border-2 border-red-500/30'
        : 'bg-gray-900 border border-red-500/50'}
    `}>
      <AlertTriangle className={`
        w-16 h-16 mb-6
        ${isCyberpunk ? 'text-red-500' : 'text-red-400'}
      `} />
      
      <h3 className={`
        text-xl font-bold mb-2
        ${isCyberpunk ? 'text-red-500 font-mono' : 'text-red-400'}
      `}>
        {isCyberpunk ? '[SYSTEM ERROR DETECTED]' : 'Something went wrong'}
      </h3>
      
      <p className={`
        text-center mb-6 max-w-md
        ${isCyberpunk ? 'text-[#00ff00]/70 font-mono' : 'text-gray-400'}
      `}>
        {isCyberpunk
          ? 'ERROR_CODE: ' + (error?.message || 'UNKNOWN_ERROR')
          : error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      
      <button
        onClick={onReset}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200
          ${isCyberpunk
            ? 'bg-black border border-red-500/30 text-red-500 hover:bg-red-500/10'
            : 'bg-red-500 text-white hover:bg-red-600'}
        `}
      >
        <RefreshCw className="w-5 h-5" />
        <span>{isCyberpunk ? '[RESTART_SYSTEM]' : 'Try Again'}</span>
      </button>
    </div>
  );
}

export default ErrorBoundary;