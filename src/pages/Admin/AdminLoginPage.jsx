import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { LoginSchema } from "../../utils/validationSchema";
import Input from "../../components/input/Input";
import { loginAPI } from "../../service/api/api.auth";
import { useAuth } from "../../hook/useAuth";
import { message } from "antd";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await loginAPI(values.email, values.password);
        
        // axios.customize returns response.data, which is { data: {...}, status: 200, message: "..." }
        const authResponse = res;
        
        // Truy cập vào authResponse.data để lấy thông tin user
        const userData = authResponse?.data;
        
        if (!userData || userData.role !== "ADMIN") {
          message.error("Tài khoản của bạn không có quyền truy cập Admin!");
          return;
        }

        loginSuccess(
          userData.accessToken, 
          userData.refreshToken,
          {
            learnerId: userData.learnerId,
            role: userData.role,
            name: userData.fullName,
            email: userData.email,
          }
        );

        message.success("Đăng nhập Admin thành công!");
        navigate("/admin");
      } catch (error) {
        console.error("Admin Login Error Detail:", error);
        // Nếu backend trả về lỗi validation chi tiết trong error.response.data
        const errorMessage = error?.message || error?.data?.message || "Đăng nhập thất bại!";
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 text-white">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-gray-500 mt-2">
            Đăng nhập quyền quản trị hệ thống
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="admin@example.com"
            icon={Mail}
            {...formik.getFieldProps("email")}
            error={formik.touched.email && formik.errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            {...formik.getFieldProps("password")}
            error={formik.touched.password && formik.errors.password}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Sign In
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>
        <p className="text-center mt-8 text-gray-600">
          Trở về <Link to="/" className="text-blue-600 font-bold hover:underline">Trang chủ</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
