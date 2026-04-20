import axios from "../axios.customize";

/**
 * Practice API Service
 * Base path: /api/v1/practice
 */

/**
 * 1. Lấy danh sách câu hỏi sai (Smart Review Lab)
 * @param {string} learnerId - UUID of the learner
 * @param {object} params - { skill, type, page, size }
 */
export const getWrongAnswersAPI = (learnerId, params = {}) => {
    return axios.get(`/api/v1/practice/wrong-answers`, {
        params: {
            learnerId,
            skill: params.skill !== 'ALL' ? params.skill : undefined,
            type: params.type !== 'ALL' ? params.type : undefined,
            page: params.page || 0,
            size: params.size || 10
        }
    });
};

/**
 * 2. Nộp bài ôn tập câu sai
 * @param {string} learnerId - UUID of the learner
 * @param {object} payload - { answers: [{ questionId, answerText, answerId }] }
 */
export const submitWrongAnswerReviewAPI = (learnerId, payload) => {
    return axios.post(`/api/v1/practice/wrong-answers/submit`, payload, {
        params: { learnerId }
    });
};
