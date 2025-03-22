import React from "react";
import PropTypes from "prop-types";

const FileInput = ({ handleImageChange, image }) => (
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
);

FileInput.propTypes = {
  handleImageChange: PropTypes.func.isRequired,
  image: PropTypes.string,
};

FileInput.defaultProps = {
  image: null,
};

export default FileInput;