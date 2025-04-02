import React from "react";
import { OBJECT_DETECTION } from "utils/Constants";
import VideoRecognition from "./VideoRecognition";

const VideoObjetRecognition = () => {
  return (
    <div className="has-background-dark has-text-light mt-5 p-5">
      <h1 className="title is-1 has-text-info">{OBJECT_DETECTION}</h1>
      <VideoRecognition/>
    </div>
  );
};

export default VideoObjetRecognition;