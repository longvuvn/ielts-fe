import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, signInWithGooglePopup } from "../config/firebase";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userInfo = localStorage.getItem("user_info");

    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const loginSuccess = (accessToken, userData) => {
    let decodedId = null;
    try {
      const decodedToken = jwtDecode(accessToken);
      console.log("JWT Decoded:", decodedToken);
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
    loginSuccess,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};