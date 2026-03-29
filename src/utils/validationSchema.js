import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Định dạng email không hợp lệ")
        .required("Email không được để trống"),
    password: Yup.string()
        .min(6, "Password cần tối thiểu 6 ký tự")
        .required("Password không được để trống"),
});

export const SignUpSchema = Yup.object().shape({
    name: Yup.string().required("Họ tên không được để trống"),
    email: Yup.string()
        .email("Định dạng email không hợp lệ")
        .required("Email không được để trống"),
    password: Yup.string()
        .min(6, "Password cần tối thiểu 6 ký tự")
        .required("Password không được để trống"),
    confirmPassword: Yup.string()
        .required("Vui lòng xác nhận mật khẩu")
        .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});
