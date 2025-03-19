import React from "react";
import ImageUploader from "./ImageUploader";

const BorderDetection = () => {
  return (
    <div className="has-background-dark has-text-light mt-5 p-5">
      <h1 className="title is-1 has-text-info">Border Detection</h1>
      <ImageUploader />
    </div>
  );
};

export default BorderDetection;