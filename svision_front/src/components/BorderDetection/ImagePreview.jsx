import React from "react";
import PropTypes from "prop-types";

const ImagePreview = ({ image }) => (
  <div style={{ marginBottom: "1rem" }}>
    <figure
      className="image"
      style={{
        maxWidth: "1000px",
        height: "auto",
        margin: "0 auto",
        border: "1px solid",
        padding: "10px",
      }}
    >
      <img src={image} alt="Original" />
    </figure>
  </div>
);

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
};

export default ImagePreview;