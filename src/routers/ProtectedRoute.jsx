import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { Spin } from "antd";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền Admin nếu truy cập vào đường dẫn /admin
  if (location.pathname.startsWith('/admin') && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
