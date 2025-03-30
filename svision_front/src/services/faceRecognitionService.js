import axios from "axios";

const BASE_URL = "http://127.0.0.1:5002";

const faceRecognitionService = {
  startCapture: async () => {
    const response = await axios.post(`${BASE_URL}/start`);
    return response.data;
  },

  stopCapture: async () => {
    const response = await axios.post(`${BASE_URL}/stop`);
    return response.data;
  },

  getAllNames: async () => {
    const response = await axios.get(`${BASE_URL}/get_all_names`);
    return response.data;
  },

  addPerson: async (formData) => {
    const response = await axios.post(`${BASE_URL}/add_person`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  addEmbedding: async (formData) => {
    const response = await axios.post(`${BASE_URL}/add_embedding`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deletePerson: async (personId) => {
    const response = await axios.delete(`${BASE_URL}/delete_person/${personId}`);
    return response.data;
  },
};

export default faceRecognitionService;