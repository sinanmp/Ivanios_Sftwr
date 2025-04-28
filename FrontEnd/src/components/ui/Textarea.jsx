import React from "react";

const Textarea = React.forwardRef(({ className = "", error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-gray-200"
      } ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea; 