import React from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { LoginSchema } from "../../utils/validationSchema";
import Input from "../../components/input/Input";

const AdminLoginPage = () => {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log("Login Data:", values);
      alert("Đã nhận dữ liệu login! (Giao diện mockup)");
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Đăng nhập để tiếp tục luyện thi IELTS
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="duy@example.com"
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
            className="w-full  bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            Sign In
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>
        <p className="text-center mt-8 text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-bg-black font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
