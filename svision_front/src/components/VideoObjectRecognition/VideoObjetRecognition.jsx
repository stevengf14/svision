import React from "react";
import { OBJECT_DETECTION_TITLE } from "../Constants";
import VideoRecognition from "./VideoRecognition";

const VideoObjetRecognition = () => {
  return (
    <div className="has-background-dark has-text-light mt-5 p-5">
      <h1 className="title is-1 has-text-info">{OBJECT_DETECTION_TITLE}</h1>
      <VideoRecognition/>
    </div>
  );
};

export default VideoObjetRecognition;