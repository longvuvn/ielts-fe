import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, signInWithGooglePopup } from "../config/firebase";
import { jwtDecode } from "jwt-decode"; // IMPORT THƯ VIỆN GIẢI MÃ

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Hàm này chạy khi F5 trang, lấy data từ localStorage ra
    const token = localStorage.getItem("access_token");
    const userInfo = localStorage.getItem("user_info");

    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // THÊM HÀM NÀY: Xử lý khi BE trả về Token thành công
  const loginSuccess = (accessToken, userData) => {
    let decodedId = null;
    try {
      // Giải mã JWT Token. Thường BE Spring Boot sẽ để ID ở trường 'sub' hoặc 'id'
      const decodedToken = jwtDecode(accessToken);
      decodedId = decodedToken.sub || decodedToken.id || decodedToken.userId;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }

    // Gộp ID vừa giải mã được vào chung với data BE trả về
    const finalUser = {
      ...userData,
      id: decodedId,
    };

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user_info", JSON.stringify(finalUser));
    setUser(finalUser);
    setIsAuthenticated(true);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithGooglePopup();
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    loginWithGoogle,
    loginSuccess, // Nhớ export hàm này ra
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
