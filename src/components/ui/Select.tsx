import type React from "react";
import type { LucideIcon } from "lucide-react";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
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
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  icon: Icon,
  variant = "bordered",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  const selectClasses = [
    "select",
    `select-${variant}`,
    "w-full",
    size !== "md" && `select-${size}`,
    Icon && "pl-12",
    error && "select-error",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
            <Icon size={18} className="text-base-content/50" />
          </span>
        )}
        <select className={selectClasses} {...props}>
          {children}
        </select>
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

// Export both as named and default export for compatibility
export { Select };
export default Select;
