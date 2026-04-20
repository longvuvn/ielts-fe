import React from "react";
import { BookOpen } from "lucide-react";
import { useGoogleAuth } from "../../hook/useGoogleAuth";
import { useNavigate } from "react-router-dom";

const UserLoginPage = () => {
  const navigate = useNavigate();
  const { handleGoogleLogin, isAuthLoading } = useGoogleAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center border border-blue-100">
        <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
          <BookOpen size={40} className="text-white" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          IELTS Master
        </h1>
        <p className="text-gray-500 mb-10 px-4">
          Nền tảng luyện thi IELTS thông minh. Đăng nhập để lưu trữ từ vựng và
          bài làm của bạn.
        </p>

        <button
          onClick={() => handleGoogleLogin(() => navigate("/"))}
          disabled={isAuthLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-blue-200 transition-all disabled:opacity-70 shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
          {isAuthLoading ? "Đang kết nối Google..." : "Tiếp tục với Google"}
        </button>
      </div>
    </div>
  );
};

export default UserLoginPage;
