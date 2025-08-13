import React from "react";

const Label = React.forwardRef<
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

export default Label;