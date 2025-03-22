import React from "react";
import PropTypes from "prop-types";

const Mode = ({ mode, setMode }) => {
  return (
    <div className="field">
      <label className="label has-text-info">Mode</label>
      <div className="control">
        <div className="radio" style={{ marginRight: "10px" }}>
          <label className="has-text-light">
            <input
              type="radio"
              name="mode"
              value="object"
              checked={mode === "object"}
              onChange={() => setMode("object")}
            />
            <span style={{ marginLeft: "5px" }}>Objecto</span>
          </label>
        </div>
        <div className="radio">
          <label className="has-text-light">
            <input
              type="radio"
              name="mode"
              value="background"
              checked={mode === "background"}
              onChange={() => setMode("background")}
            />
            <span style={{ marginLeft: "5px" }}>Fodo</span>
          </label>
        </div>
      </div>
    </div>
  );
};

Mode.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
};

export default Mode;
