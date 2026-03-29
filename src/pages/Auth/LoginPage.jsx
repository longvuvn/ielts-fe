import React, { useState } from "react";
import { message } from "antd";
import { BookOpen } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginWithGoogleAPI } from "../../service/api/api.auth";

const UserLoginPage = () => {
  const { loginWithGoogle, loginSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // 1. Lấy user từ Firebase
      const user = await loginWithGoogle();
      const idToken = await user.getIdToken();

      // 2. Gọi API xuống Spring Boot
      const res = await loginWithGoogleAPI(idToken);

      // DEBUG: Duy hãy mở Console xem cục này in ra cái gì nhé
      console.log("Kết quả từ API:", res);

      // 3. Kiểm tra status (Dựa trên ApiResponse.java của bạn là trường 'status')
      // Vì Interceptor đã bóc tách rồi, nên res lúc này chính là object ApiResponse
      if (res && res.status === 200) {
        const authInfo = res.data; // res.data chính là AuthResponse (chứa accessToken, fullName...)

        message.success(`Chào mừng ${authInfo.fullName} đã đăng nhập!`);

        loginSuccess(authInfo.accessToken, {
          role: authInfo.role,
          name: authInfo.fullName,
          email: authInfo.email,
        });

        navigate("/library");
      } else {
        // Nếu res.status không phải 200 hoặc res bị null
        message.error(res?.message || "Xác thực Backend thất bại!");
      }
    } catch (error) {
      console.error("Lỗi login:", error);
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };
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
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-blue-200 transition-all disabled:opacity-70 shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
          {isLoading ? "Đang kết nối Google..." : "Tiếp tục với Google"}
        </button>
      </div>
    </div>
  );
};

export default UserLoginPage;
