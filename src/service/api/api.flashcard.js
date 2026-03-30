import axios from "../axios.customize"

const getFlashcardsByLibraryIdAPI = (libraryId, page = 0, size = 10) => {
    const API_URL = `/api/v1/flashcard/library/${libraryId}?page=${page}&size=${size}`;
    return axios.get(API_URL);
}

const createFlashcardAPI = (title, description, libraryId) => {
    const API_URL = "/api/v1/flashcard";
    const data = {
        title: title,
        description: description,
        libraryId: libraryId,
        status: "ACTIVE"
    }
    return axios.post(API_URL, data);
}

const deleteFlashcardAPI = (id) => {
    const API_URL = `/api/v1/flashcard/${id}`;
    return axios.delete(API_URL);
}
export { getFlashcardsByLibraryIdAPI, createFlashcardAPI, deleteFlashcardAPI }