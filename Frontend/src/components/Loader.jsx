const Loader = ({ label = "Loading...", full = false }) => {
  return (
    <div className={`${full ? "min-h-[60vh]" : "min-h-[200px]"} w-full flex flex-col items-center justify-center gap-4`}>
      <div className="relative flex items-center justify-center">
        {/* Spinning Outer Ring */}
        <div className="w-20 h-20 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin"></div>
        {/* Logo in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/Logo.png" 
            alt="Loading..." 
            className="w-10 h-10 object-contain animate-pulse"
          />
        </div>
      </div>
      <p className="text-rose-600 font-medium animate-pulse">{label}</p>
    </div>
  );
};

export default Loader;


