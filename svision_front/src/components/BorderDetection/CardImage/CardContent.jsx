import React from "react";
import PropTypes from "prop-types";

const CardContent = ({ selectedImage, handleDownload, processedImages }) => (
  <div className="card-content" style={{ textAlign: "center" }}>
    <p>
      <strong>Seed:</strong> {selectedImage.seed}
    </p>
    <p>
      <strong>Mode:</strong> {selectedImage.mode}
    </p>
    <p>
      <strong>Threshold 1:</strong> {selectedImage.threshold1}
    </p>
    <p>
      <strong>Threshold 2:</strong> {selectedImage.threshold2}
    </p>
    <div className="buttons is-centered">
      <button
        className="button is-link"
        onClick={() =>
          handleDownload(
            selectedImage.imageBase64,
            processedImages.indexOf(selectedImage)
          )
        }
      >
        <span className="icon">
          <i className="fas fa-download"></i>
        </span>
        <span>Download</span>
      </button>
    </div>
  </div>
);

CardContent.propTypes = {
  selectedImage: PropTypes.shape({
    seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mode: PropTypes.string,
    threshold1: PropTypes.number,
    threshold2: PropTypes.number,
    imageBase64: PropTypes.string,
  }).isRequired,
  handleDownload: PropTypes.func.isRequired,
  processedImages: PropTypes.arrayOf(
    PropTypes.shape({
      imageBase64: PropTypes.string,
      seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mode: PropTypes.string,
      threshold1: PropTypes.number,
      threshold2: PropTypes.number,
    })
  ).isRequired,
};

export default CardContent;