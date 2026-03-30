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
        username: email, // Thêm username đề phòng backend dùng username
        password: password
    });
}
