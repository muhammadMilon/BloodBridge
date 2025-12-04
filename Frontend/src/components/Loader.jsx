const Loader = ({ label = "Loading...", full = false }) => {
  return (
    <div className={`${full ? "min-h-[50vh]" : ""} w-full flex items-center justify-center py-10`}>
      <div className="flex items-center gap-3">
        <span className="relative inline-flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600"></span>
        </span>
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
    </div>
  );
};

export default Loader;


