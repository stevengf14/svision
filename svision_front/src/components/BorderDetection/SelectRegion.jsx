import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Image } from "react-konva";

const SelectRegion = ({ image, onRegionSelected }) => {
  const [shapeType, setShapeType] = useState("rect"); // Selected shape (rectangle, circle, polygon)
  const [drawing, setDrawing] = useState(false);
  const [shapeProps, setShapeProps] = useState({});
  const [points, setPoints] = useState([]);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const [konvaImage, setKonvaImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  // Load the image into an HTMLImageElement object for use with Konva
  useEffect(() => {
    if (image) {
      const img = new window.Image();
      img.src = image;
      img.onload = () => {
        setKonvaImage(img);

        // Save the original dimensions of the image
        setOriginalDimensions({ width: img.width, height: img.height });

        // Calculate image dimensions to fit the container
        const maxWidth = 900; // Maximum width (same as ImageUploader)
        const maxHeight = 900; // Maximum height (same as ImageUploader)
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        setImageDimensions({ width, height });
      };
    }
  }, [image]);

  // Function to handle the start of drawing
  const handleMouseDown = (e) => {
    const stage = stageRef.current;
    const mousePos = stage.getPointerPosition();
    if (shapeType === "polygon") {
      setPoints([...points, mousePos.x, mousePos.y]);
    } else {
      setShapeProps({
        ...shapeProps,
        x: mousePos.x,
        y: mousePos.y,
      });
    }
    setDrawing(true);
  };

  // Function to handle mouse movement (to draw the shape)
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const stage = stageRef.current;
    const mousePos = stage.getPointerPosition();

    if (shapeType === "rect") {
      setShapeProps({
        ...shapeProps,
        width: mousePos.x - shapeProps.x,
        height: mousePos.y - shapeProps.y,
      });
    } else if (shapeType === "circle") {
      const radius = Math.sqrt(
        Math.pow(mousePos.x - shapeProps.x, 2) + Math.pow(mousePos.y - shapeProps.y, 2)
      );
      setShapeProps({
        ...shapeProps,
        radius: radius,
      });
    }
  };

  // Function to handle when drawing the shape is finished
  const handleMouseUp = () => {
    setDrawing(false);

    // Adjust the coordinates of the selected region to the original dimensions of the image
    const scaleX = originalDimensions.width / imageDimensions.width;
    const scaleY = originalDimensions.height / imageDimensions.height;

    const adjustedShapeProps = {
      x: shapeProps.x * scaleX,
      y: shapeProps.y * scaleY,
      width: shapeProps.width * scaleX,
      height: shapeProps.height * scaleY,
      radius: shapeProps.radius * scaleX,
    };

    const adjustedPoints = points.map((point, index) => {
      return index % 2 === 0 ? point * scaleX : point * scaleY;
    });

    onRegionSelected(shapeType, adjustedShapeProps, adjustedPoints); // Send to parent
  };

  // Draw the selected shape
  const drawShape = () => {
    switch (shapeType) {
      case "rect":
        return (
          <Rect
            x={shapeProps.x}
            y={shapeProps.y}
            width={shapeProps.width}
            height={shapeProps.height}
            stroke="red"
            strokeWidth={2}
            dash={[10, 5]}
          />
        );
      case "circle":
        return (
          <Circle
            x={shapeProps.x}
            y={shapeProps.y}
            radius={shapeProps.radius}
            stroke="red"
            strokeWidth={2}
            dash={[10, 5]}
          />
        );
      case "polygon":
        return (
          <Line
            points={points}
            stroke="red"
            strokeWidth={2}
            closed={true}
            fill="rgba(255, 0, 0, 0.5)"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="box" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Radio for selecting the shape */}
      <div className="field" style={{ marginBottom: "20px" }}>
        <label className="label">Select a shape:</label>
        <div className="control">
          <label className="radio pr-4">
            <input
              type="radio"
              value="rect"
              checked={shapeType === "rect"}
              onChange={() => setShapeType("rect")}
            />
            Rectangle
          </label>
          <label className="radio pr-4">
            <input
              type="radio"
              value="circle"
              checked={shapeType === "circle"}
              onChange={() => setShapeType("circle")}
            />
            Circle
          </label>
          <label className="radio">
            <input
              type="radio"
              value="polygon"
              checked={shapeType === "polygon"}
              onChange={() => setShapeType("polygon")}
            />
            Polygon
          </label>
        </div>
      </div>

      {/* Canvas for the image and shapes */}
      <Stage
        width={imageDimensions.width}
        height={imageDimensions.height}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid #ddd" }}
      >
        <Layer>
          {konvaImage && (
            <Image
              image={konvaImage}
              ref={imageRef}
              width={imageDimensions.width}
              height={imageDimensions.height}
              x={0}
              y={0}
              draggable={false}
            />
          )}
          {drawShape()}
        </Layer>
      </Stage>
    </div>
  );
};

export default SelectRegion;