import axios from "../axios.customize";

// Learner API
export const getAllLearnersAPI = () => {
    return axios.get("/api/v1/learners");
};

// Crawler API
export const runCrawlerAPI = (limit = 1) => {
    return axios.post(`/api/v1/crawler/run?limit=${limit}`);
};

// Topic & Vocabulary API extensions (for CRUD)
export const updateVocabularyAPI = (id, data) => {
    return axios.put(`/api/v1/vocabularies/${id}`, data);
};

export const deleteVocabularyAPI = (id) => {
    return axios.delete(`/api/v1/vocabularies/${id}`);
};

export const getVocabulariesByTopicAPI = (topicId, page = 1, size = 10) => {
    return axios.get(`/api/v1/vocabularies/topic/${topicId}?page=${page}&size=${size}`);
};
