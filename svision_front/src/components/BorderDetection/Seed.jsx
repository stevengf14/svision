import React from "react";
import PropTypes from "prop-types";

const Seed = ({ seed, setSeed }) => {
  return (
    <div className="field">
      <label className="label has-text-info">Seed</label>
      <div className="control">
        <input
          className="input"
          type="number"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          min="0"
          style={{ borderColor: "#1E90FF" }}
        />
      </div>
    </div>
  );
};

Seed.propTypes = {
  seed: PropTypes.number.isRequired,
  setSeed: PropTypes.func.isRequired,
};

export default Seed;