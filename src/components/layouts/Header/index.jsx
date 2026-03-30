// src/components/layouts/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, BookOpen } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useGoogleAuth } from "../../../hook/useGoogleAuth"; // Gọi Hook vừa tạo

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { handleGoogleLogin, isAuthLoading } = useGoogleAuth(); // Lấy hàm và state loading từ Hook

  const handleLogout = async () => {
    await logout();
    // Đăng xuất thì cứ để yên ở trang chủ, không cần navigate
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
      {/* LOGO */}
      <div className="text-2xl font-bold text-blue-600">
        <Link to="/">IELTS Master</Link>
      </div>

      {/* KHU VỰC ĐIỀU HƯỚNG BÊN PHẢI */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          // === UI KHI ĐÃ ĐĂNG NHẬP ===
          <>
            <span className="text-gray-800 font-bold hidden md:block">
              Hello, {user?.name}
            </span>

            <Link
              to="/library"
              className="text-gray-600 font-medium hover:text-blue-600 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 transition-all"
            >
              <BookOpen size={18} />{" "}
              <span className="hidden md:block">Library</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 font-medium hover:text-red-600 flex items-center gap-1 ml-2 p-2 hover:bg-red-50 rounded-lg transition-all"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          // === UI KHI CHƯA ĐĂNG NHẬP ===
          <>
            <Link
              to="/admin-login"
              className="text-gray-500 font-medium hover:text-blue-500 hidden md:block text-sm"
            >
              Admin Login
            </Link>

            <button
              onClick={handleGoogleLogin}
              disabled={isAuthLoading}
              className="bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-2 transition-all disabled:opacity-70 shadow-md"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 bg-white rounded-full p-0.5"
              />
              {isAuthLoading ? "Đang xử lý..." : "Sign up with Google"}
            </button>
          </>
        )}

        {/* NÚT MENU MOBILE */}
        <Menu
          className="md:hidden text-gray-700 cursor-pointer hover:text-black"
          size={28}
        />
      </div>
    </header>
  );
};

export default Header;
