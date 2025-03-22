import axios from "axios";

export const processImage = async (file, seed, mode, shapeType, shapeProps, points) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("seed", seed);
  formData.append("mode", mode);
  if (shapeType) {
    formData.append("shapeType", shapeType);
    formData.append("shapeProps", shapeProps);
    formData.append("points", points);
  }
  
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/process_image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const { image_base64, threshold1, threshold2 } = response.data;
    return {
      imageBase64: image_base64,
      threshold1,
      threshold2,
      seed,
      mode,
    };
  } catch (error) {
    console.error("Error processing the image", error);
    throw error;
  }
};