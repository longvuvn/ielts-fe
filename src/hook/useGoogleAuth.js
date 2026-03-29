// src/hooks/useGoogleAuth.js
import { useState } from "react";
import { message } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { loginWithGoogleAPI } from "../service/api/api.auth";

export const useGoogleAuth = () => {
    const { loginWithGoogle, loginSuccess } = useAuth();
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            setIsAuthLoading(true);

            // 1. Gọi Firebase lấy Token (Giống hệt file HTML bạn test)
            const firebaseUser = await loginWithGoogle();
            const idToken = await firebaseUser.getIdToken();

            // 2. Gửi Token xuống Spring Boot
            const res = await loginWithGoogleAPI(idToken);

            // 3. XỬ LÝ KẾT QUẢ (Sửa lại đoạn này cho khớp ApiResponse.java)
            // 'res' lúc này chính là object {status: 200, message: "...", data: {...}}
            if (res && res.status === 200) {
                const authResponseData = res.data; // Đây là AuthResponse (token, fullName...)

                message.success(`Chào mừng ${authResponseData.fullName}!`);

                // Lưu vào Context
                loginSuccess(authResponseData.accessToken, {
                    role: authResponseData.role,
                    name: authResponseData.fullName,
                    email: authResponseData.email,
                });
            } else {
                // Nếu backend trả về status khác 200
                message.error(res?.message || "Xác thực Backend thất bại!");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            message.error("Đăng nhập thất bại hoặc đã bị hủy.");
        } finally {
            setIsAuthLoading(false);
        }
    };

    return { handleGoogleLogin, isAuthLoading };
};