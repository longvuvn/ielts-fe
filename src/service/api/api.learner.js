import axios from "../axios.customize";

/**
 * Learner API Service
 * Base path: /api/v1/learners
 */
export const getLearnerHistoryAPI = (learnerId, page = 0, size = 10) => {
    return axios.get(`/api/v1/learners/${learnerId}/history`, {
        params: {
            page,
            size
        }
    });
};

export const updateLearnerAPI = (id, updateData) => {
    return axios.put(`/api/v1/learners/${id}`, updateData);
};

export const getLearnerByIdAPI = (id) => {
    return axios.get(`/api/v1/learners/${id}`);
};

export const uploadAvatarAPI = (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.patch(`/api/v1/learners/${id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
