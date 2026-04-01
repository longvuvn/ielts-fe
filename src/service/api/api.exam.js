import axios from "../axios.customize";

/**
 * Exam API Service
 * Base path: /api/v1/exams
 */

// Lấy danh sách exam phân trang
export const getAllExamsAPI = (page = 0, size = 10) => {
    return axios.get(`/api/v1/exams?page=${page}&size=${size}`);
};

// Lấy danh sách section theo examId
export const getSectionsByExamIdAPI = (examId) => {
    return axios.get(`/api/v1/exams/${examId}/sections`);
};

/**
 * Section API Service
 * Base path: /api/v1/section
 */

// Lấy nội dung passage theo sectionId
export const getSectionContentAPI = (sectionId) => {
    return axios.get(`/api/v1/section/${sectionId}/content`);
};

// Cập nhật bài thi
export const updateExamAPI = (id, data) => {
    return axios.put(`/api/v1/exams/${id}`, data);
};

// Xóa bài thi
export const deleteExamAPI = (id) => {
    return axios.delete(`/api/v1/exams/${id}`);
};
