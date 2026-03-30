import React from "react";

const Button = ({
  variant = "primary",
  size = "md",
  children,
  icon: Icon,
  className = "",
  ...props
}) => {
  const baseStyles = "font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "premium-button-primary",
    secondary: "premium-button-secondary",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-xl",
    outline: "bg-transparent border border-border-default text-text-secondary hover:border-accent hover:text-accent rounded-xl",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 16 : 20} />}
      {children}
    </button>
  );
};

export default Button;
