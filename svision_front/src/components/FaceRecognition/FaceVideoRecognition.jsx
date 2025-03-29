import React from "react";
import { FACE_DETECTION_TITLE } from "../Constants";
import FaceRecognition from "./FaceRecognition";

const FaceVideoObjetRecognition = () => {
  return (
    <div className="has-background-dark has-text-light mt-5 p-5">
      <h1 className="title is-1 has-text-info">{FACE_DETECTION_TITLE}</h1>
      <FaceRecognition/>
    </div>
  );
};

export default FaceVideoObjetRecognition;