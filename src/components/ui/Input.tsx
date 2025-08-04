import React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`input input-bordered w-full bg-base-100 text-base-content ${className}`}
  />
));
Input.displayName = "Input";
