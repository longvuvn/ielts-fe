import React from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { User, Mail, Lock, CheckCircle } from "lucide-react";
import { SignUpSchema } from "../../utils/validationSchema";
import Input from "../../components/input/input";

const RegisterPage = () => {
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      console.log("Register Data:", values);
      alert("Đăng ký thành công! (Giao diện mockup)");
    },
  });

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2">
            Bắt đầu hành trình chinh phục IELTS cùng đội ngũ Master
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Duy Nguyễn"
            icon={User}
            {...formik.getFieldProps("name")}
            error={formik.touched.name && formik.errors.name}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="email@example.com"
            icon={Mail}
            {...formik.getFieldProps("email")}
            error={formik.touched.email && formik.errors.email}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...formik.getFieldProps("password")}
              error={formik.touched.password && formik.errors.password}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={CheckCircle}
              {...formik.getFieldProps("confirmPassword")}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
            >
              Create Master Account
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-bg-black font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
