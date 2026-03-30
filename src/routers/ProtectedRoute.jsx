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

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isAuthenticated) {
    // Nếu là route admin thì về trang login admin, ngược lại về login user
    return <Navigate to={isAdminRoute ? "/admin-login" : "/login"} replace state={{ from: location }} />;
  }

  // Kiểm tra quyền Admin nếu truy cập vào đường dẫn /admin
  if (isAdminRoute && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
