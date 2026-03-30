import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, BookOpen, LayoutDashboard, Home, User, Bell } from "lucide-react";
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
    <header className="sticky top-0 z-[1000] w-full border-b border-border-default bg-page/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-accent p-2 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-accent/25">
            <BookOpen className="text-white" size={22} />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-text-primary">
            IELTS<span className="text-accent">Master</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          {navItems.map((item) => (
            (!item.private || isAuthenticated) && (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
             <button className="hidden sm:flex p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors border border-transparent hover:border-border-default">
                <Bell size={20} />
             </button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-3 border-l border-border-default">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-text-primary leading-tight">{user?.name || "Người dùng"}</p>
                <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest mt-0.5">{user?.role || "Premium Learner"}</p>
              </div>
              
              <div className="relative group/user">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-700 p-[1px]">
                  <div className="w-full h-full rounded-[11px] bg-page flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                    <User size={20} className="text-accent" />
                  </div>
                </div>
                
                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-elevated border border-border-default rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/user:opacity-100 group-hover/user:translate-y-0 group-hover/user:pointer-events-auto transition-all duration-200 p-2 z-[1001]">
                   <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              disabled={isAuthLoading}
              className="flex items-center gap-2.5 bg-text-primary text-page px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-90 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4"
              />
              {isAuthLoading ? "Đang kết nối..." : "Bắt đầu ngay"}
            </button>
          )}

          {/* MOBILE MENU */}
          <button className="md:hidden p-2.5 text-text-secondary hover:text-text-primary bg-white/5 rounded-xl border border-border-default">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
