import React from "react";
import PropTypes from "prop-types";

const CardHeader = ({ handleCloseImage }) => (
  <header className="card-header">
    <button
      className="delete"
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 2,
        cursor: "pointer",
      }}
      onClick={handleCloseImage}
    ></button>
  </header>
);

CardHeader.propTypes = {
  handleCloseImage: PropTypes.func.isRequired,
};

export default CardHeader;