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
    // Nếu API trả về cấu trúc có trường 'data' lồng nhau, ta có thể bóc tách ở đây
    // Tuy nhiên để tương thích với code hiện tại của bạn, tôi sẽ trả về response.data
    return response && response.data ? response.data : response;
}, function (error) {
    NProgress.done();
    // Thay vì return error.response.data (khiến nó thành resolve), ta phải dùng Promise.reject
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
});

export default instance;