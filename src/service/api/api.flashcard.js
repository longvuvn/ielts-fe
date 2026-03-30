import axios from "../axios.customize"

const getFlashcardsByLibraryIdAPI = (libraryId, page = 0, size = 10) => {
    const API_URL = `/api/v1/flashcard/library/${libraryId}?page=${page}&size=${size}`;
    return axios.get(API_URL);
}

const createFlashcardAPI = ({ title, description, libraryId }) => {
    return axios.post("/api/v1/flashcard", { title, description, libraryId });
};

const updateFlashcardAPI = (id, { title, description, libraryId, status = "ACTIVE" }) => {
    const API_URL = `/api/v1/flashcard/${id}`;
    return axios.put(API_URL, { title, description, libraryId, status });
};

const deleteFlashcardAPI = (id) => {
    const API_URL = `/api/v1/flashcard/${id}`;
    return axios.delete(API_URL);
}
export { getFlashcardsByLibraryIdAPI, createFlashcardAPI, updateFlashcardAPI, deleteFlashcardAPI }