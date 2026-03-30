import axios from "../axios.customize";

/**
 * Writing API Service
 * Base path: /api/v1/writing
 */
export const gradeWritingAPI = (writingData) => {
    // writingData: content, prompt...
    return axios.post("/api/v1/writing/grade", writingData);
};

/**
 * Submission API Service
 * Base path: /api/v1/submissions
 */
export const createSubmissionAPI = (submissionData) => {
    // submissionData: examId, sectionId, answers...
    return axios.post("/api/v1/submissions/", submissionData);
};
