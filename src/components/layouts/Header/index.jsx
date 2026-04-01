import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  BookOpen,
  LayoutDashboard,
  Home,
  User,
  Bell,
  Settings,
} from "lucide-react";
import { useAuth } from "../../../hook/useAuth";
import { useGoogleAuth } from "../../../hook/useGoogleAuth";
import { getFullImageUrl } from "../../../utils";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { handleGoogleLogin, isAuthLoading } = useGoogleAuth();
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Trang chủ", path: "/", icon: <Home size={18} /> },
    {
      name: "Đề thi",
      path: "/exams",
      icon: <BookOpen size={18} />,
      private: true,
    },
    {
      name: "Thư viện",
      path: "/library",
      icon: <LayoutDashboard size={18} />,
      private: true,
    },
  ];

  const isActive = (path) => location.pathname === path;

  // 🔍 Lấy URL avatar từ nhiều field có khả năng xảy ra
  const userAvatarPath = user?.avatarUrl || user?.avatar || user?.picture || user?.photoUrl || user?.image;
  const fullAvatarUrl = getFullImageUrl(userAvatarPath);

  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-accent p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/20">
            <BookOpen className="text-white" size={22} />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-slate-900">
            IELTS<span className="text-accent">Master</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1.5 rounded-[20px] border border-slate-100">
          {navItems.map(
            (item) =>
              (!item.private || isAuthenticated) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-sm font-bold transition-all duration-300 ${isActive(item.path)
                      ? "bg-white text-accent shadow-sm ring-1 ring-slate-100"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ),
          )}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button className="hidden sm:flex p-3 rounded-2xl text-slate-400 hover:text-accent hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
              <Bell size={20} />
            </button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {user?.role || "LEARNER"}
                </p>
              </div>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`relative group/avatar flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-500 ${isUserMenuOpen
                      ? "ring-4 ring-accent/10 scale-95"
                      : "hover:scale-105 active:scale-95"
                    }`}
                >
                  {/* Outer Glow & Gradient Border */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent to-blue-400 opacity-20 ${isUserMenuOpen ? "opacity-100" : "group-hover/avatar:opacity-40"} transition-opacity`}
                  />

                  {/* Inner Container */}
                  <div className="absolute inset-[2px] rounded-[14px] bg-white flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm z-10">
                    {fullAvatarUrl ? (
                      <img
                        src={fullAvatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=f0f7ff&color=3b82f6&bold=true`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                        <span className="text-sm font-black text-accent">
                          {user?.name ? (
                            user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          ) : (
                            <User size={18} />
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center z-20 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                </button>

                {/* User Dropdown */}
                <div
                  className={`absolute right-0 top-full mt-4 w-64 bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 z-[1001] transition-all duration-300 ease-out ${isUserMenuOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                >
                  {/* SECTION 1: USER INFO */}
                  <div className="px-4 py-4 mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-accent text-sm font-black border border-blue-100 overflow-hidden">
                        {fullAvatarUrl ? (
                          <img
                            src={fullAvatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=f0f7ff&color=3b82f6&bold=true`;
                            }}
                          />
                        ) : (
                          user?.name?.charAt(0) || "U"
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {user?.name || "Người dùng"}
                        </span>
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-lg mt-1 w-fit">
                          {user?.role || "LEARNER"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: MENU ITEMS */}
                  <div className="space-y-1 border-t border-slate-50 pt-2">
                    {[
                      {
                        icon: User,
                        text: "Chỉnh sửa thông tin",
                        path: "/profile",
                      },
                      { icon: Bell, text: "Thông báo", path: "#" },
                      {
                        icon: BookOpen,
                        text: "Lịch sử luyện tập",
                        path: "/history",
                      },
                      { icon: Settings, text: "Cài đặt", path: "#" },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-accent hover:bg-blue-50/50 transition-all cursor-pointer group"
                      >
                        <item.icon
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>{item.text}</span>
                      </Link>
                    ))}
                  </div>

                  {/* SECTION 3: DANGER ZONE */}
                  <div className="mt-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
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
