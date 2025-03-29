import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ClipLoader from "react-spinners/ClipLoader";
import comino from "./comino.jpg";

const ProcessedVideos = ({ isVideoProcess, display, isLoading }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const color = "#ffffff";

  useEffect(() => {
    if (isVideoProcess) {
      console.log("dnasda");
      setVideoUrl("http://127.0.0.1:5000/video_feed");
    } else {
      console.log("nononono");
      setVideoUrl("");
    }
  }, [isVideoProcess]);

  return (
    <div>
      <div className="box has-background-black">
        <h3 className="title is-4 has-text-primary">Processed Video</h3>
        <div className=" mt-2">
          <div id="video_container" style={{ display }}>
            <figure style={{ border: "1px solid #00d1b2", padding: "10px"}}>
              <img id="video_feed" src={videoUrl} alt="Processed Video" />
            </figure>
          </div>
          {isLoading && (
            <div className="card-content is-flex is-justify-content-center is-align-items-center is-flex-direction-column">
            <ClipLoader
              color={color}
              loading={isLoading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <p className="has-text-light mt-3">Loading camera ...</p>
          </div>
          )}
          {!(isVideoProcess || isLoading) && (
            <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
              <img id="video_feed" src={comino} width="90%" />
              <p className="has-text-light mt-3">No processed video yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProcessedVideos.propTypes = {
  isVideoProcess: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

ProcessedVideos.defaultProps = {
  isVideoProcess: false,
  isLoading: false,
};

export default ProcessedVideos;