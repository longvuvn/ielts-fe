import axios from "../axios.customize";

export const getAllLibrariesByLearnerIdAPI = (learnerId, page = 0, size = 3) => {
    const API_URL = `/api/v1/library/learner/${learnerId}?page=${page}&size=${size}`;
    return axios.get(API_URL);
};

export const createLibraryAPI = ({ name, description, is_Public, learnerId }) => {
    const API_URL = "/api/v1/library";
    const data = {
        name,
        description,
        is_Public: String(is_Public),
        learnerId,
    };
    return axios.post(API_URL, data);
};

export const updateLibraryAPI = (id, { name, description, is_Public, learnerId, createdAt, updatedAt }) => {
    const API_URL = `/api/v1/library/${id}`;
    const data = {
        name,
        description,
        is_Public: String(is_Public),
        learnerId,
        createdAt,
        updatedAt
    };
    return axios.put(API_URL, data);
};

export const searchLibraryAPI = (name, page = 0, size = 10) => {
    const API_URL = `/api/v1/library/search?name=${name}&page=${page}&size=${size}`;
    return axios.get(API_URL);
};

export const getLibraryByIdAPI = (id) => {
    const API_URL = `/api/v1/library/${id}`;
    return axios.get(API_URL);
};

export const softDeleteLibraryAPI = (id) => {
    const API_URL = `/api/v1/library/soft-delete/${id}`;
    return axios.delete(API_URL);
};

export const deleteLibraryAPI = (id) => {
    const API_URL = `/api/v1/library/${id}`;
    return axios.delete(API_URL);
};