import type React from "react";
import useLazyComponent from "../hooks/useLazyComponent";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";

interface LazyComponentWrapperProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingMessage?: string;
  [key: string]: any;
}

const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({
  importFunc,
  fallback,
  errorFallback,
  loadingMessage,
  ...props
}) => {
  const { Component, loading, error } = useLazyComponent(importFunc);

  if (loading) {
    return fallback || <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return (
      errorFallback || (
        <ErrorBoundary
          fallback={
            <div className="p-8 text-center">
              <p className="text-error">
                Failed to load component: {error.message}
              </p>
            </div>
          }
        >
          <div>Error loading component</div>
        </ErrorBoundary>
      )
    );
  }

  if (!Component) {
    return fallback || <LoadingSpinner message="Component not found" />;
  }

  return (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default LazyComponentWrapper;
