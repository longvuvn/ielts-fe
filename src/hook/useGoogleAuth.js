// src/hooks/useGoogleAuth.js
import { useState } from "react";
import { message } from "antd";
import { useAuth } from "./useAuth";
import { loginWithGoogleAPI } from "../service/api/api.auth";

export const useGoogleAuth = () => {
    const { loginWithGoogle, loginSuccess } = useAuth();
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const handleGoogleLogin = async (onSuccessCallback) => {
        try {
            setIsAuthLoading(true);

            // 1. Gọi Firebase lấy Token
            const firebaseUser = await loginWithGoogle();
            const idToken = await firebaseUser.getIdToken();

            // 2. Gửi Token xuống Spring Boot
            const res = await loginWithGoogleAPI(idToken);
            console.log("🔍 API Login Response Data:", res.data); // DEBUG DỮ LIỆU BACKEND

            // 3. XỬ LÝ KẾT QUẢ
            if (res && (res.status === 200 || res.status === 201)) {
                const authResponseData = res.data;
                message.success(`Chào mừng ${authResponseData.fullName}!`);

                loginSuccess(
                    authResponseData.accessToken, 
                    authResponseData.refreshToken,
                    {
                        learnerId: authResponseData.learnerId,
                        role: authResponseData.role,
                        name: authResponseData.fullName,
                        email: authResponseData.email,
                    }
                );

                if (typeof onSuccessCallback === "function") {
                    onSuccessCallback();
                }
            }
        } catch (error) {

            console.error("Lỗi đăng nhập:", error);
            // 'error' lúc này chính là error.response.data được reject từ interceptor
            message.error(error?.message || "Đăng nhập thất bại hoặc đã bị hủy.");
        } finally {
            setIsAuthLoading(false);
        }
    };

    return { handleGoogleLogin, isAuthLoading };
};