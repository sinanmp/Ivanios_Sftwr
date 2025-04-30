import React from "react";
import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = "button",
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:hover:bg-blue-600",
    secondary: "bg-gray-600 text-white shadow-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:hover:bg-gray-600",
    success: "bg-green-600 text-white shadow-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:hover:bg-green-600",
    danger: "bg-red-600 text-white shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:hover:bg-red-600",
    warning: "bg-yellow-500 text-white shadow-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:hover:bg-yellow-500",
    info: "bg-cyan-500 text-white shadow-md hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:hover:bg-cyan-500",
    outline: "border-2 bg-transparent hover:bg-gray-50 focus:ring-2 focus:ring-offset-2",
    soft: "bg-opacity-20 hover:bg-opacity-30 focus:ring-2 focus:ring-offset-2",
    ghost: "hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    link: "hover:underline focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 p-0 shadow-none",
  };

  // Additional styles for outline and soft variants
  const variantStyles = {
    outline: {
      primary: "border-blue-600 text-blue-600 focus:ring-blue-500",
      secondary: "border-gray-600 text-gray-600 focus:ring-gray-500",
      success: "border-green-600 text-green-600 focus:ring-green-500",
      danger: "border-red-600 text-red-600 focus:ring-red-500",
      warning: "border-yellow-500 text-yellow-500 focus:ring-yellow-500",
      info: "border-cyan-500 text-cyan-500 focus:ring-cyan-500",
    },
    soft: {
      primary: "bg-blue-600 text-blue-600",
      secondary: "bg-gray-600 text-gray-600",
      success: "bg-green-600 text-green-600",
      danger: "bg-red-600 text-red-600",
      warning: "bg-yellow-500 text-yellow-500",
      info: "bg-cyan-500 text-cyan-500",
    }
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
    icon: {
      xs: "p-1",
      sm: "p-1.5",
      md: "p-2",
      lg: "p-2.5",
      xl: "p-3"
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Get the correct variant styles
  const getVariantStyles = () => {
    if (variant === 'outline' && variantStyles.outline[props.color]) {
      return `${variants[variant]} ${variantStyles.outline[props.color]}`;
    }
    if (variant === 'soft' && variantStyles.soft[props.color]) {
      return `${variants[variant]} ${variantStyles.soft[props.color]}`;
    }
    return variants[variant];
  };

  // Get the correct size styles
  const getSizeStyles = () => {
    if (leftIcon || rightIcon) {
      return sizes.icon[size];
    }
    return sizes[size];
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(
        baseStyles,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          <span className="ml-2">{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// Prop types for better documentation
Button.propTypes = {
  /** The content of the button */
  children: PropTypes.node.isRequired,
  /** The variant of the button */
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'outline',
    'soft',
    'ghost',
    'link'
  ]),
  /** The size of the button */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Additional classes to be added to the button */
  className: PropTypes.string,
  /** Whether the button is in a loading state */
  isLoading: PropTypes.bool,
  /** Whether the button is disabled */
  disabled: PropTypes.bool,
  /** Icon to be displayed before the button text */
  leftIcon: PropTypes.node,
  /** Icon to be displayed after the button text */
  rightIcon: PropTypes.node,
  /** Whether the button should take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** The type of the button */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** For outline and soft variants, the color of the button */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info'
  ])
};

export default Button;
  