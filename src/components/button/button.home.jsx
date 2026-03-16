import React from "react";

const Button = ({
  variant = "primary",
  size = "md",
  children,
  icon: Icon,
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg transition-all duration-200";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} flex items-center gap-2`}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;
