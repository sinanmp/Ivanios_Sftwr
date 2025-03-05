const Spinner = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-transparent bg-opacity-20 backdrop-blur-[3px] z-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default Spinner;
  