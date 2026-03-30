import axios from "../axios.customize"


const createVocabularyAPI = (topicId, word, ipa, example, audio_url, definition, part_of_speech) => {
    const API_URL = "/api/v1/vocabularies/create";
    const data = {
        topicId: topicId,
        word: word,
        ipa: ipa,
        example: example,
        audio_url: audio_url,
        definition: definition,
        part_of_speech: part_of_speech
    }
    return axios.post(API_URL, data);
}
const importExcelVocabularyAPI = (file, topicId) => {
    const API_URL = `/api/v1/vocabularies`;
    const data = new FormData();
    data.append("file", file);
    data.append("topicId", topicId);

    return axios.post(API_URL, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}
export { createVocabularyAPI, importExcelVocabularyAPI }