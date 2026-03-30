import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, BookOpen, LayoutDashboard, Home, User } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useGoogleAuth } from "../../../hook/useGoogleAuth";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { handleGoogleLogin, isAuthLoading } = useGoogleAuth();
  const location = useLocation();

  const navItems = [
    { name: "Trang chủ", path: "/", icon: <Home size={18} /> },
    { name: "Đề thi", path: "/exams", icon: <BookOpen size={18} />, private: true },
    { name: "Thư viện", path: "/library", icon: <LayoutDashboard size={18} />, private: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-white/5 bg-[#060d1a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
            <BookOpen className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold font-serif bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            IELTS Master
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            (!item.private || isAuthenticated) && (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-white leading-tight">{user?.name || "Người dùng"}</p>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{user?.role || "Learner"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg">
                <User size={20} className="text-white" />
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isAuthLoading}
              className="flex items-center gap-2.5 bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4"
              />
              {isAuthLoading ? "Đang kết nối..." : "Đăng nhập"}
            </button>
          )}

          {/* MOBILE MENU */}
          <button className="md:hidden p-2 text-gray-400 hover:text-white">
            <Menu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
