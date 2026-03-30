import axios from "../axios.customize";

// Learner API
export const getAllLearnersAPI = () => {
    return axios.get("/api/v1/learners");
};

// Crawler API
export const runCrawlerAPI = (data) => {
    return axios.post("/api/v1/crawler/run", data);
};

export const runAnswerKeyCrawlerAPI = (data) => {
    return axios.post("/api/v1/crawler/answer-key", data);
};

// Topic & Vocabulary API extensions (for CRUD)
export const updateVocabularyAPI = (id, data) => {
    return axios.put(`/api/v1/vocabularies/${id}`, data);
};

export const deleteVocabularyAPI = (id) => {
    return axios.delete(`/api/v1/vocabularies/${id}`);
};

export const getVocabulariesByTopicAPI = (topicId) => {
    return axios.get(`/api/v1/vocabularies/topic/${topicId}`);
};
