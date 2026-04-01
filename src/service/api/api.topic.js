import axios from "../axios.customize"

export const getAllTopicsAPI = () => {
    const API_URL = "/api/v1/topics";
    return axios.get(API_URL);
}