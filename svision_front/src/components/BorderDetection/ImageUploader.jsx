import React, { useState } from "react";
import Seed from "./Seed";
import Mode from "./Mode";
import ProcessedImages from "./ProcessedImages";
import SelectRegion from "./SelectRegion";
import { processImage } from "../../services/imageService";
import ImagePreview from "./ImagePreview";
import FileInput from "./FileInput";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [processedImages, setProcessedImages] = useState([]);
  const [seed, setSeed] = useState(100);
  const [mode, setMode] = useState("object");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectRegion, setSelectRegion] = useState(false);
  const [shapeType, setShapeType] = useState("");
  const [shapeProps, setShapeProps] = useState({});
  const [points, setPoints] = useState([]);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setProcessedImages([]);
  };

  const handleRegionSelected = (type, props, points) => {
    setShapeType(type);
    setShapeProps(props);
    setPoints(points);
  };

  const handleSubmit = async () => {
    try {
      const file = document.querySelector("input[type=file]").files[0];
      let newProcessedImage = null;

      if (selectRegion) {
        const pointsData =
          shapeType === "polygon" ? JSON.stringify(points) : null;

        newProcessedImage = await processImage(
          file,
          seed,
          mode,
          shapeType,
          JSON.stringify(shapeProps),
          pointsData
        );
      } else {
        newProcessedImage = await processImage(file, seed, mode);
      }

      setProcessedImages([newProcessedImage, ...processedImages]);
    } catch (error) {
      console.error("Error processing the image", error);
    }
  };

  const handleReset = () => {
    setImage(null);
    setProcessedImages([]);
    setSeed(100);
    setMode("object");
    setSelectedImage(null);
    setShapeType("");
    setShapeProps({});
    setPoints([]);
    setSelectRegion(false);
  };

  return (
    <div className="has-background-dark has-text-light is-info">
      <FileInput handleImageChange={handleImageChange} image={image} />

      {image && <ImagePreview image={image} />}

      <div className="field mb-4">
  <button
    className={`button ${selectRegion ? "is-success" : "is-warning"}`}
    onClick={() => setSelectRegion(!selectRegion)}
  >
    {selectRegion ? "Process All" : "Select Region"}
  </button>
</div>

      {selectRegion && (
        <SelectRegion image={image} onRegionSelected={handleRegionSelected} />
      )}

      <Seed seed={seed} setSeed={setSeed} />
      <Mode mode={mode} setMode={setMode} />

      <div className="buttons">
        <button className="button is-info" onClick={handleSubmit}>
          Process
        </button>
        <button className="button is-danger" onClick={handleReset}>
          Reset
        </button>
      </div>

      <ProcessedImages
        processedImages={processedImages}
        setProcessedImages={setProcessedImages}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default ImageUploader;
