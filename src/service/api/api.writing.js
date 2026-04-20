import axios from "../axios.customize";

export const getAllExamsAPI = (page, size, skillType = "WRITING") => {
    return axios.get(`/api/v1/exams?page=${page}&size=${size}&skillType=${skillType}`);
};

export const getQuestionByExamIdAPI = (examId) => {
    return axios.get(`/api/v1/exams/${examId}`);
};

export const gradeWritingAPI = (questionId, answerText) => {
    // Axios customize của bạn đã có gắn Bearer Token chưa? 
    // Nếu chưa, hãy đảm bảo Header Authorization có JWT.
    return axios.post("/api/v1/writing/grade", {
        questionId,
        answerText
    });
};