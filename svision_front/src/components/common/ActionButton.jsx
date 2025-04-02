import PropTypes, { func } from "prop-types";
import ClipLoader from "react-spinners/ClipLoader";
import React from "react";
import "utils/global.css";
import { START_VIDEO, STOP_VIDEO } from "utils/Constants.jsx";

const ActionButton = ({
  startCapture,
  stopCapture,
  isCapturing,
  isLoading,
}) => {
  return (
    <div>
      <div className="columns mt-2 mb-2 is-centered">
        <div className="field is-flex is-align-items-center">
          <button
            className="button is-info mr-3"
            onClick={startCapture}
            disabled={isCapturing || isLoading}
          >
            {isLoading ? (
              <ClipLoader
                color={"#ffffff"}
                loading={isLoading}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
                className="mr-2"
              />
            ) : (
              <i className="fas fa-play mr-2" />
            )}
            {START_VIDEO}
          </button>
          <button
            className="button is-danger"
            onClick={stopCapture}
            disabled={!isCapturing}
          >
            <i className="fas fa-stop mr-2" /> {STOP_VIDEO}
          </button>
        </div>
      </div>
    </div>
  );
};

ActionButton.propTypes = {
  startCapture: func.isRequired,
  stopCapture: func.isRequired,
  isCapturing: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

ActionButton.defaultProps = {
  isCapturing: false,
  isLoading: false,
  startCapture: () => {},
  stopCapture: () => {},
};

export default ActionButton;
