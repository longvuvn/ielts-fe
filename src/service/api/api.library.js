import axios from "../axios.customize";

export const getAllLibrariesByLearnerIdAPI = (learnerId, page = 0, size = 10) => {
    const API_URL = `/api/v1/library/learner/${learnerId}?page=${page}&size=${size}`;
    return axios.get(API_URL);
};

export const createLibraryAPI = ({ name, description, is_Public, learnerId }) => {
    const API_URL = "/api/v1/library";
    const data = {
        name,
        description,
        is_Public: String(is_Public),   // backend nhận string "True"/"False"
        learnerId,
    };
    return axios.post(API_URL, data);
};

export const deleteLibraryAPI = (id) => {
    const API_URL = `/api/v1/library/${id}`;
    return axios.delete(API_URL);
};