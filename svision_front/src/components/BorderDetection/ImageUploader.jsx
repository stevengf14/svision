import React, { useState } from "react";
import Seed from "./Seed";
import Mode from "./Mode";
import ProcessedImages from "./ProcessedImages";
import { processImage } from "../../services/imageService";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [processedImages, setProcessedImages] = useState([]);
  const [seed, setSeed] = useState(100);
  const [mode, setMode] = useState("object");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setProcessedImages([]); // Clear previous processed images when a new image is selected
  };

  const handleSubmit = async () => {
    try {
      const file = document.querySelector("input[type=file]").files[0];
      const newProcessedImage = await processImage(file, seed, mode);
      setProcessedImages([newProcessedImage, ...processedImages]);
    } catch (error) {
      console.error("Error processing the image", error);
    }
  };

  const handleReset = () => {
    setImage(null);
    setProcessedImages([]);
    setSeed(100);
    setMode("object");
    setSelectedImage(null);
  };

  return (
    <div className="has-background-dark has-text-light is-info">
      {/* Input for selecting the image */}
      <div className="file has-name is-boxed is-info">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">Choose an image…</span>
          </span>
          {image && <span className="file-name">Image selected</span>}
        </label>
      </div>

      {/* Display original image */}
      {image && (
        <div style={{ marginBottom: "1rem" }}>
          <figure
            className="image"
            style={{ maxWidth: "500px", margin: "0 auto", border: "1px solid", padding: "10px" }}
          >
            <img src={image} alt="Original" />
          </figure>
        </div>
      )}

      {/* Seed and mode controls */}
      <Seed seed={seed} setSeed={setSeed} />
      <Mode mode={mode} setMode={setMode} />

      {/* Submit and reset buttons */}
      <div className="buttons">
        <button className="button is-info" onClick={handleSubmit}>
          Process Image
        </button>
        <button className="button is-danger" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Display processed images */}
      <ProcessedImages
        processedImages={processedImages}
        setProcessedImages={setProcessedImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default ImageUploader;
