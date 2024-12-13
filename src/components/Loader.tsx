import React from "react";

const Loader = ({ color = "#3498db" }) => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-white bg-opacity-80">
      <div
        className="border-4 border-gray-200 border-t-[4px] rounded-full w-10 h-10 animate-spin"
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );
};

export default Loader;
