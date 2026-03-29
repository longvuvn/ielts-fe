import axios from "../axios.customize";

export const getAllLibrariesByLearnerIdAPI = (learnerId, page = 0, size = 10) => {
    const API_URL = `/api/v1/library/learner/${learnerId}?page=${page}&size=${size}`;
    return axios.get(API_URL);
}

// Sửa lại: Nhận thêm biến learnerId ở đây
export const createLibraryAPI = (name, learnerId) => {
    const API_URL = "/api/v1/library";
    const data = {
        name: name,
        status: "ACTIVE",
        learnerId: learnerId // Lấy dữ liệu động, không hardcode nữa
    }
    return axios.post(API_URL, data);
}

export const deleteLibraryAPI = (id) => {
    const API_URL = `/api/v1/library/${id}`;
    return axios.delete(API_URL);
}