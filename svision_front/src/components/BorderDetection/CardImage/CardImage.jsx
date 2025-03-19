import React from "react";
import PropTypes from "prop-types";

const CardImage = ({ imageBase64 }) => (
  <div className="card-image">
    <figure className="image is-4by3" style={{ margin: "0 auto", padding: "10px" }}>
      <img src={imageBase64} alt="Full Image" style={{ border: "1px solid #ddd", padding: "5px" }} />
    </figure>
  </div>
);

CardImage.propTypes = {
  imageBase64: PropTypes.string.isRequired,
};

export default CardImage;