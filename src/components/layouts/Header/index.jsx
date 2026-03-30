import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  BookOpen,
  ChevronDown,
  Edit3,
  Headphones,
  Book,
  Mic2,
} from "lucide-react";
import { Dropdown, Space } from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import { useGoogleAuth } from "../../../hook/useGoogleAuth";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { handleGoogleLogin, isAuthLoading } = useGoogleAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Cấu hình các mục cho Dropdown kỹ năng
  const skillItems = [
    {
      key: "LISTENING",
      label: "Listening",
      icon: <Headphones size={16} className="text-blue-500" />,
    },
    {
      key: "READING",
      label: "Reading",
      icon: <Book size={16} className="text-green-500" />,
    },
    {
      key: "WRITING",
      label: "Writing",
      icon: <Edit3 size={16} className="text-orange-500" />,
    },
    {
      key: "SPEAKING",
      label: "Speaking",
      icon: <Mic2 size={16} className="text-purple-500" />,
    },
  ];

  const handleSkillClick = ({ key }) => {
    // Chuyển hướng sang trang danh sách đề kèm query skill
    navigate(`/exams?skill=${key}`);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
      {/* 1. LEFT: LOGO */}
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">IELTS Master</Link>
        </div>

        {/* 2. MIDDLE: SKILLS DROPDOWN (Chỉ hiện khi đã đăng nhập hoặc tùy bạn) */}
        <nav className="hidden md:block">
          <Dropdown
            menu={{ items: skillItems, onClick: handleSkillClick }}
            trigger={["hover"]}
          >
            <button className="flex items-center gap-1 text-gray-700 font-medium hover:text-blue-600 transition-colors">
              Practice Skills <ChevronDown size={18} />
            </button>
          </Dropdown>
        </nav>
      </div>

      {/* 3. RIGHT: AUTH AREA */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-gray-800 font-bold text-sm">
                {user?.name}
              </span>
            </div>

            <Link
              to="/library"
              className="text-gray-600 font-medium hover:text-blue-600 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 transition-all"
            >
              <BookOpen size={18} />
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
          <>
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
              {isAuthLoading ? "Processing..." : "Sign up"}
            </button>
          </>
        )}

        <Menu className="md:hidden text-gray-700 cursor-pointer" size={28} />
      </div>
    </header>
  );
};

export default Header;
