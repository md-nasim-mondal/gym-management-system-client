'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerProps {
  children: React.ReactNode;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Handle global unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      // Show toast notification for unhandled promise rejections
      toast.error(
        event.reason?.message || 'An unexpected error occurred. Please try again.'
      );
      
      // Prevent the default browser behavior
      event.preventDefault();
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global Error:', event.error);
      
      // Show toast notification for global errors
      toast.error(
        event.error?.message || 'An unexpected error occurred. Please try again.'
      );
      
      // Prevent the default browser behavior
      event.preventDefault();
      setHasError(true);
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Clean up event listeners
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
            Something went wrong
          </h2>
          <p className="mb-6 text-center text-gray-600">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorHandler;