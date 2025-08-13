import type React from "react";
import type { LucideIcon } from "lucide-react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  legend?: string; // Added legend prop for fieldset structure
  error?: string;
  icon?: LucideIcon; // Added icon support
  variant?:
    | "bordered"
    | "ghost"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  size?: "xs" | "sm" | "md" | "lg";
  useFieldset?: boolean; // Added option to use fieldset structure
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  legend, // Added legend parameter
  error,
  icon: Icon, // Added icon parameter
  variant = "bordered",
  size = "md",
  useFieldset = false, // Added useFieldset parameter
  className = "",
  ...props
}) => {
  const textareaClasses = [
    "textarea",
    `textarea-${variant}`,
    "w-full",
    size !== "md" && `textarea-${size}`,
    error && "textarea-error",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (useFieldset && legend) {
    return (
      <div className="form-control mb-6">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{legend}</legend>
          <div className="relative">
            <textarea
              className={`textarea textarea-bordered rounded-lg w-full ${
                Icon ? "pl-10 pt-3" : ""
              } ${className}`}
              {...props}
            />
            {Icon && (
              <Icon className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
            )}
          </div>
        </fieldset>
        {error && <p className="text-error text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

// Export both as named and default export for compatibility
export { Textarea };
export default Textarea;
