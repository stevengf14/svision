import React from "react";
import PropTypes from "prop-types";
import '@fortawesome/fontawesome-free/css/all.min.css';
import CardHeader from "./CardImage/CardHeader";
import CardImage from "./CardImage/CardImage";
import CardContent from "./CardImage/CardContent";

const SelectedImage = ({ selectedImage, setSelectedImage, processedImages }) => {
  const handleDownload = (base64Image, index) => {
    const link = document.createElement("a");
    link.href = base64Image;
    link.download = `processed_image_${index + 1}.jpg`;
    link.click();
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="card" style={{ marginTop: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <CardHeader handleCloseImage={handleCloseImage} />
      <CardImage imageBase64={selectedImage.imageBase64} />
      <CardContent
        selectedImage={selectedImage}
        handleDownload={handleDownload}
        processedImages={processedImages}
      />
    </div>
  );
};

SelectedImage.defaultProps = {
  selectedImage: {
    imageBase64: "",
    seed: "",
    mode: "",
    threshold1: 0,
    threshold2: 0,
  },
  setSelectedImage: () => {},
};

SelectedImage.propTypes = {
  selectedImage: PropTypes.shape({
    imageBase64: PropTypes.string,
    seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mode: PropTypes.string,
    threshold1: PropTypes.number,
    threshold2: PropTypes.number,
  }),
  setSelectedImage: PropTypes.func,
  processedImages: PropTypes.arrayOf(
    PropTypes.shape({
      imageBase64: PropTypes.string,
      seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mode: PropTypes.string,
      threshold1: PropTypes.number,
      threshold2: PropTypes.number,
    })
  ),
};

export default SelectedImage;