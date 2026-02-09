import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-background hover:bg-accent hover:text-primary transition-colors",
  secondary:
    "bg-transparent border border-primary text-primary hover:bg-primary hover:text-background transition-colors",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

/**
 * Button component with brand styling
 *
 * Variants:
 * - primary: Solid button with brand charcoal background
 * - secondary: Outline button with charcoal border
 *
 * Sizes:
 * - sm: Small, compact padding
 * - md: Default medium size
 * - lg: Large, prominent padding
 *
 * @example
 * <Button variant="primary" size="md">Ajouter au panier</Button>
 * <Button variant="secondary">En savoir plus</Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-wide rounded-[--radius-button] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
