import axios from "../axios.customize";

/**
 * Writing API Service
 * Base path: /api/v1/writing
 */
export const gradeWritingAPI = (questionId, answerText) => {
    return axios.post("/api/v1/writing/grade", { questionId, answerText });
};

/**
 * Submission API Service
 */
export const createSubmissionAPI = (submissionData) => {
    return axios.post("/api/v1/submissions", submissionData);
};
