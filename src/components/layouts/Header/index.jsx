import React from "react";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          <span className="font-bold text-xl text-black">IELTS Master</span>
        </div>

        {/* Menu */}
        <div className="hidden md:flex gap-8">
          {["Overview", "Study", "Practice", "Resources"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-gray-700 hover:text-blue-500 font-medium transition"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-gray-700 font-medium hover:text-blue-500">
            Sign In
          </button>
          <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800">
            Get Started
          </button>
          <Menu className="md:hidden" size={24} />
        </div>
      </div>
    </nav>
  );
};
export default Header;
