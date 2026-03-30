import axios from "../axios.customize"

export const loginWithGoogleAPI = (firebaseToken) => {
    const API_URL = "/api/v1/auth/login/google";
    return axios.post(API_URL, {
        idToken: firebaseToken
    });
}