import React from "react";

const KpiBadge = ({ color = "indigo", icon: Icon, label, value }) => {
  const bg = {
    indigo: "bg-indigo-100 text-indigo-700",
    orange: "bg-orange-100 text-orange-700",
    pink: "bg-pink-100 text-pink-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
  }[color] || "bg-gray-100 text-gray-700";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${bg} whitespace-nowrap shadow-sm`}> 
      {Icon ? <Icon className="w-4 h-4" /> : null}
      <span className="text-xs font-semibold">{value}</span>
      <span className="text-xs opacity-80">{label}</span>
    </div>
  );
};

export default KpiBadge;
