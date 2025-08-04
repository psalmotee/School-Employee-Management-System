"use client";
import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-error" />
              </div>
              <h2 className="card-title justify-center text-error">
                Something went wrong!
              </h2>
              <p className="text-base-content/60 mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;