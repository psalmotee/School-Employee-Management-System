import type React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "",
}) => {
  return (
    <div className="flex justify-center items-center min-h-[200px] bg-base-100">
      <div className="flex flex-col items-center gap-4">
        <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></span>
        <p className="text-base-content opacity-70">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
