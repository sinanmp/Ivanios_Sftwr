import React from "react";

const Card = ({ children, variant = "default", className = "", hoverable = false, ...props }) => {
  const baseStyles = "rounded-xl overflow-hidden transition-all duration-200";
  
  const variants = {
    default: "bg-white shadow-md",
    elevated: "bg-white shadow-lg",
    bordered: "bg-white border border-gray-200",
    flat: "bg-gray-50",
  };

  const hoverStyles = hoverable ? "hover:shadow-xl hover:scale-[1.02]" : "";

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`p-6 border-b border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`p-6 border-t border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };
  