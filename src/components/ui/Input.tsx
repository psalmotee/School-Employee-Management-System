import type React from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  legend?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
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
  useFieldset?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  legend,
  error,
  icon: Icon,
  iconPosition = "left",
  variant = "bordered",
  size = "md",
  useFieldset = false,
  className = "",
  ...props
}) => {
  const inputClasses = [
    "input",
    `input-${variant}`,
    "w-full",
    size !== "md" && `input-${size}`,
    error && "input-error",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (useFieldset && legend) {
    return (
      <div className="form-control mb-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{legend}</legend>
          <div className="relative">
            {Icon && iconPosition === "left" && (
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                <Icon size={18} className="text-base-content/50" />
              </span>
            )}
            <input
              className={`${inputClasses} ${
                Icon && iconPosition === "left" ? "pl-12" : ""
              } ${Icon && iconPosition === "right" ? "pr-12" : ""}`}
              {...props}
            />
            {Icon && iconPosition === "right" && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
                <Icon size={18} className="text-base-content/50" />
              </span>
            )}
          </div>
        </fieldset>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
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
      <div className="relative">
        {Icon && iconPosition === "left" && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 z-1">
            <Icon size={18} className="text-base-content/50" />
          </span>
        )}
        <input
          className={`${inputClasses} ${
            Icon && iconPosition === "left" ? "pl-12" : ""
          } ${Icon && iconPosition === "right" ? "pr-12" : ""}`}
          {...props}
        />
        {Icon && iconPosition === "right" && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
            <Icon size={18} className="text-base-content/50" />
          </span>
        )}
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

// Export both as named and default export for compatibility
export { Input };
export default Input;

