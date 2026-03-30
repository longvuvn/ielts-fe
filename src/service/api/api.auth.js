import axios from "../axios.customize"

export const loginWithGoogleAPI = (firebaseToken) => {
    const API_URL = "/api/v1/auth/login/google";
    return axios.post(API_URL, {
        idToken: firebaseToken
    });
}

export const loginAPI = (email, password) => {
    const API_URL = "/api/v1/auth/login";
    return axios.post(API_URL, {
        email: email, 
        password: password
    });
}

export const refreshTokenAPI = (refreshToken) => {
    const API_URL = "/api/v1/auth/refresh-token";
    return axios.post(API_URL, { refreshToken });
}

export const logoutAPI = (refreshToken) => {
    const API_URL = "/api/v1/auth/logout";
    return axios.post(API_URL, { refreshToken });
}
