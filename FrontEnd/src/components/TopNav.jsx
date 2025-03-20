import React from "react";
import { FaExpand, FaBell } from "react-icons/fa";

const TopNav = () => {
  return (
    <div className="flex justify-end items-center gap-4">
      <img src="/us-flag.png" alt="Country" className="w-6 h-4" />
      <FaExpand className="text-xl cursor-pointer text-gray-600 hover:text-gray-800" />
      <FaBell className="text-xl cursor-pointer text-gray-600 hover:text-gray-800" />
    </div>
  );
};

export default TopNav;
