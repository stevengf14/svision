import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

const API = {
  startCapture: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/start`);
      return response.data;
    } catch (error) {
      console.error("Error al iniciar la captura:", error);
      return { status: "error" };
    }
  },

  stopCapture: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/stop`);
      return response.data;
    } catch (error) {
      console.error("Error al detener la captura:", error);
      return { status: "error" };
    }
  },

  setObject: async (option) => {
    try {
      const response = await axios.post(`${BASE_URL}/set_object`, {
        option: option,  // Enviar la opción en el cuerpo JSON
      });
      return response.data;
    } catch (error) {
      console.error("Error al establecer la opción:", error);
      return { status: "error" };
    }
  },
};

export default API;
