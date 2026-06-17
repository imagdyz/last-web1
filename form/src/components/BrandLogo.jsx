import React from "react";

function BrandLogo({ size = "md", showText = true }) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizes[size]} rounded-full bg-purple-100 flex items-center justify-center shadow-sm ring-2 ring-purple-200`}
      >
        <span className="text-purple-600 font-bold text-xl">B</span>
      </div>
      {showText && (
        <span className="text-purple-600 text-sm font-medium">BrandHub</span>
      )}
    </div>
  );
}

export default BrandLogo;
