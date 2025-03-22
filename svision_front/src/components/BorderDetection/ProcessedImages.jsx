import React from "react";
import PropTypes from "prop-types";
import SelectedImage from "./SelectedImage";

const ProcessedImages = ({
  processedImages,
  setProcessedImages,
  selectedImage,
  setSelectedImage,
}) => {
  const handleThumbnailClick = (img) => {
    setSelectedImage(img);
  };

  const handleDeleteThumbnail = (index) => {
    const newProcessedImages = processedImages.filter((_, i) => i !== index);
    setProcessedImages(newProcessedImages);
  };

  return (
    <div className="is-link" style={{ marginTop: "2rem" }}>
      {/* Display selected full image */}
      {selectedImage && (
        <SelectedImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          processedImages={processedImages}
        />
      )}
      <h3 className="title is-4">Processed Images</h3>
      <div className="columns is-multiline">
        {processedImages.length > 0 ? (
          processedImages.map((img, index) => (
            <div
              key={index}
              className="column is-3"
              style={{ position: "relative", marginBottom: "1rem" }}
            >
              <button
                className="button is-danger is-small"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  zIndex: 1,
                }}
                onClick={() => handleDeleteThumbnail(index)}
              >
                <i className="fas fa-trash"></i>
              </button>
              <figure
                className="image is-4by3"
                onClick={() => handleThumbnailClick(img)}
                style={{
                  cursor: "pointer",
                  maxWidth: "200px",
                  marginBottom: "1rem",
                  border: "1px solid #FFFFF",
                  padding: "10px",
                }}
              >
                <img
                  src={img.imageBase64}
                  alt={`Processed Thumbnail ${index + 1}`}
                />
              </figure>
            </div>
          ))
        ) : (
          <p className="has-text-light">No processed images yet.</p>
        )}
      </div>
    </div>
  );
};

ProcessedImages.propTypes = {
  processedImages: PropTypes.array.isRequired,
  setProcessedImages: PropTypes.func.isRequired,
  selectedImage: PropTypes.object,
  setSelectedImage: PropTypes.func.isRequired,
};

ProcessedImages.defaultProps = {
  processedImages: [],
  selectedImage: null,
};

export default ProcessedImages;
