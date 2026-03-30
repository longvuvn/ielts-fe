import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Cookies from 'js-cookie';

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
});

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

instance.interceptors.request.use(function (config) {
    NProgress.start();
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, function (error) {
    NProgress.done();
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    NProgress.done();
    return response && response.data ? response.data : response;
}, async function (error) {
    NProgress.done();
    const originalRequest = error.config;

    // Check if the error is 401 or 403 and hasn't been retried yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
            .then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return instance(originalRequest);
            })
            .catch(err => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) {
            isRefreshing = false;
            // Clear local storage and redirect if no refresh token
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            // Optional: window.location.href = '/login';
            return Promise.reject(error);
        }

        try {
            // Call refresh token API
            const res = await axios.post(`${instance.defaults.baseURL}/api/v1/auth/refresh-token`, { 
                refreshToken 
            });
            
            const newAccessToken = res.data?.data?.access_token || res.data?.access_token;
            
            if (newAccessToken) {
                localStorage.setItem('access_token', newAccessToken);
                instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                return instance(originalRequest);
            }
        } catch (refreshError) {
            processQueue(refreshError, null);
            Cookies.remove('refresh_token');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
});

export default instance;
