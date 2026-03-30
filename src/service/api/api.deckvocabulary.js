import axios from "../axios.customize";

// Lấy tất cả vocabulary trong một flashcard
export const getVocabulariesByFlashcardIdAPI = (flashcardId) => {
    return axios.get(`/api/v1/deck-vocabulary/flashcard/${flashcardId}`);
};

// Tạo vocabulary mới trong flashcard
export const createDeckVocabularyAPI = ({ flashcardId, word, userDefinition }) => {
    return axios.post("/api/v1/deck-vocabulary", { flashcardId, word, userDefinition });
};

// Xóa vocabulary khỏi flashcard
export const deleteDeckVocabularyAPI = (id) => {
    return axios.delete(`/api/v1/deck-vocabulary/${id}`);
};

// Cập nhật deck vocabulary
export const updateDeckVocabularyAPI = (id, { flashcardId, vocabularyId, userDefinition, status = "ACTIVE" }) => {
    return axios.put(`/api/v1/deck-vocabulary/${id}`, { flashcardId, vocabularyId, userDefinition, status });
};

// Search từ vựng từ dictionary
export const searchVocabularyAPI = (word, page = 0, size = 10) => {
    return axios.get(`/api/v1/vocabularies/search?word=${encodeURIComponent(word)}&page=${page}&size=${size}`);
};