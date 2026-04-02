import React, { useState } from "react";
import imageEnhancementService from "../../services/imageEnhancementService";
import ClipLoader from "react-spinners/ClipLoader";

const ImageEnhancement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOriginalPreview(URL.createObjectURL(file));
      setEnhancedImage(null);
      setError(null);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await imageEnhancementService.enhanceImage(formData);
      
      // The response is a blob representing the image
      const imageUrl = URL.createObjectURL(response);
      setEnhancedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError("An error occurred during image enhancement. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container has-text-light p-5">
      <h1 className="title has-text-white mb-5">AI Image Enhancement (Real-ESRGAN)</h1>
      <div className="box">
        <div className="field">
          <label className="label">Upload low-resolution image:</label>
          <div className="file has-name is-boxed is-centered">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">Select Image</span>
              </span>
              {selectedFile && <span className="file-name has-text-white">{selectedFile.name}</span>}
            </label>
          </div>
        </div>

        <div className="has-text-centered mt-4">
          <button
            className="button is-primary"
            onClick={handleEnhance}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <ClipLoader color={"#ffffff"} size={20} className="mr-2" />
            ) : (
              <i className="fas fa-magic mr-2"></i>
            )}
            {isLoading ? "Enhancing via AI..." : "Enhance Image"}
          </button>
        </div>

        {error && <p className="has-text-danger mt-3 has-text-centered">{error}</p>}

        <div className="columns mt-5">
          <div className="column is-hlaf">
            {originalPreview && (
              <div className="card">
                <div className="card-header">
                  <p className="card-header-title">Original (Low-Res)</p>
                </div>
                <div className="card-content has-text-centered" style={{minHeight: "300px"}}>
                  <img src={originalPreview} alt="Original" style={{maxWidth: "100%", maxHeight: "400px"}} />
                </div>
              </div>
            )}
          </div>
          <div className="column is-half">
            {enhancedImage ? (
              <div className="card" style={{boxShadow: "0 0 15px rgba(0, 210, 255, 0.5)"}}>
                <div className="card-header">
                  <p className="card-header-title">Enhanced (Real-ESRGAN AI)</p>
                </div>
                <div className="card-content has-text-centered" style={{minHeight: "300px"}}>
                  <img src={enhancedImage} alt="Enhanced" style={{maxWidth: "100%", maxHeight: "400px"}} />
                </div>
                <footer className="card-footer">
                   <a href={enhancedImage} download="enhanced_image.png" className="card-footer-item has-text-white button is-info" style={{border: 'none', borderRadius: '0 0 16px 16px'}}>
                      <i className="fas fa-download mr-2"></i> Download Result
                   </a>
                </footer>
              </div>
            ) : (
              originalPreview && (
                <div className="card">
                  <div className="card-header">
                     <p className="card-header-title">Enhanced Preview</p>
                  </div>
                  <div className="card-content has-text-centered is-flex is-justify-content-center is-align-items-center" style={{minHeight: "300px", opacity: 0.5}}>
                     <p><i>The AI result will appear here...</i></p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageEnhancement;
