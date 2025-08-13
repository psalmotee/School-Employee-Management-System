import type React from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  shape?: "square" | "circle";
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
  fullWidth?: boolean;
  soft?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  shape,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  children,
  className = "",
  disabled,
  fullWidth = false,
  soft = true,
  ...props
}) => {
  const buttonClasses = [
    "btn",
    "transition-all",
    "duration-200",
    `btn-${variant}`,
    size !== "md" && `btn-${size}`,
    shape && `btn-${shape}`,
    fullWidth && "btn-block",
    loading && "loading",
    soft && "btn-soft",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      {loading && (
        <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></span>
      )}
      {!loading && Icon && iconPosition === "left" && (
        <Icon
          size={
            size === "xs" ? 14 : size === "sm" ? 16 : size === "lg" ? 24 : 20
          }
          className="mr-1"
        />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && (
        <Icon
          size={
            size === "xs" ? 14 : size === "sm" ? 16 : size === "lg" ? 24 : 20
          }
          className="ml-1"
        />
      )}
    </button>
  );
};

// Export both as named and default export for compatibility
export { Button };
export default Button;
