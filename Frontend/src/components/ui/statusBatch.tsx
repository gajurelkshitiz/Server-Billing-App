import React from "react";

const StatusBadge = ({ value }: { value: boolean | string }) => {
  // Accepts boolean or string ("true"/"false")
  const isActive = value === true || value === "true";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isActive
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-red-100 text-red-700 border border-red-300"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

export default StatusBadge;