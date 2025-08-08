import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`input input-bordered w-full bg-base-100 text-base-content ${className}`}
    />
  );
});
Input.displayName = "Input";
