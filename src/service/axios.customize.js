import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
});

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
});

instance.interceptors.request.use(function (config) {
    NProgress.start();
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    return config;
}, function (error) {
    NProgress.done();
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    NProgress.done();
    return response;
}, function (error) {
    NProgress.done();
    if (error.response && error.response.status === 401) {
        // Xử lý khi token hết hạn hoặc không hợp lệ
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        // Có thể redirect về /login ở đây nếu cần
    }
    return Promise.reject(error);
});

export default instance;