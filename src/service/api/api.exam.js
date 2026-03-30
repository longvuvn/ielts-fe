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
    return axios.get(`/api/v1/exams/${examId}`);
};

/**
 * Section API Service
 * Base path: /api/v1/section
 */

// Lấy nội dung passage theo sectionId
export const getSectionContentAPI = (sectionId) => {
    return axios.get(`/api/v1/section/${sectionId}/content`);
};
