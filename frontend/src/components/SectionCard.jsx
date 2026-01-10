const SectionCard = ({ children, className = "", noPadding = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${noPadding ? "" : "p-6"} ${className}`}>
      {children}
    </div>
  );
};


export default SectionCard;
