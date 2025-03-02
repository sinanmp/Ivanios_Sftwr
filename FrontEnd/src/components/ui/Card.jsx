export function Card({ children, className }) {
    return (
      <div className={`bg-white p-6 shadow-xl rounded-lg ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children }) {
    return <div className="mt-4">{children}</div>;
  }
  