import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGooglePopup } from "../config/firebase";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContextInstance";
import Cookies from "js-cookie";
import { logoutAPI } from "../service/api/api.auth";
import { getLearnerByIdAPI } from "../service/api/api.learner";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_info");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("access_token");
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch full user details if authenticated
  useEffect(() => {
    const fetchFullUserInfo = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const res = await getLearnerByIdAPI(user.id);
          if (res && res.data) {
            const fullUserData = res.data.data || res.data;
            const updatedUser = {
              ...user,
              ...fullUserData,
              name: fullUserData.fullName || fullUserData.name || user.name,
              avatarUrl: fullUserData.avatarUrl || fullUserData.avatar || user.avatarUrl,
            };
            
            // Only update if data actually changed to avoid unnecessary re-renders
            if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
              setUser(updatedUser);
              localStorage.setItem("user_info", JSON.stringify(updatedUser));
            }
          }
        } catch (error) {
          console.error("Error fetching full user info:", error);
        }
      }
    };

    fetchFullUserInfo();
  }, [isAuthenticated, user?.id]);

  const loginSuccess = (accessToken, refreshToken, userData) => {
    let decodedId = null;
    try {
      const decodedToken = jwtDecode(accessToken);
      decodedId =
        decodedToken.learnerId ||
        decodedToken.userId ||
        decodedToken.id ||
        decodedToken.user_id ||
        decodedToken.sub;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }

    const finalUser = {
      ...userData,
      id: decodedId,
    };

    localStorage.setItem("access_token", accessToken);
    
    // Set refresh token in cookie with 7 days expiration and security flags
    if (refreshToken) {
      Cookies.set("refresh_token", refreshToken, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict' 
      });
    }

    localStorage.setItem("user_info", JSON.stringify(finalUser));
    setUser(finalUser);
    setIsAuthenticated(true);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithGooglePopup();
    return result.user;
  };

  const logout = async () => {
    const refreshToken = Cookies.get("refresh_token");
    if (refreshToken) {
      try {
        await logoutAPI(refreshToken);
      } catch (error) {
        console.error("Lỗi gọi API logout:", error);
      }
    }

    await signOut(auth);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    Cookies.remove("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    loginWithGoogle,
    loginSuccess,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
