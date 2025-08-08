import React from "react";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`label-text font-medium text-sm ${className}`}
    {...props}
  />
));
Label.displayName = "Label";
