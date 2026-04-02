import axios from "axios";

// Assuming we map port 5003 for the image scaler microservice
const imageEnhancementService = {
  enhanceImage: async (formData) => {
    const response = await axios.post("http://localhost:5003/enhance", formData, {
      responseType: 'blob' // Important to receive the image file correctly
    });
    return response.data;
  }
};

export default imageEnhancementService;
