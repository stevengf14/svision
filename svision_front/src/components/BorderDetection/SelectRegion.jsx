import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line, Image } from "react-konva";

const SelectRegion = ({ image, onRegionSelected }) => {
  const [shapeType, setShapeType] = useState("rect"); // Forma seleccionada (rectángulo, círculo, polígono)
  const [drawing, setDrawing] = useState(false);
  const [shapeProps, setShapeProps] = useState({});
  const [points, setPoints] = useState([]);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const [konvaImage, setKonvaImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  // Cargar la imagen en un objeto HTMLImageElement para usar con Konva
  useEffect(() => {
    if (image) {
      const img = new window.Image();
      img.src = image;
      img.onload = () => {
        setKonvaImage(img);

        // Guardar las dimensiones originales de la imagen
        setOriginalDimensions({ width: img.width, height: img.height });

        // Calcular las dimensiones de la imagen para ajustarla al contenedor
        const maxWidth = 900; // Ancho máximo (igual al de ImageUploader)
        const maxHeight = 900; // Alto máximo (igual al de ImageUploader)
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

  // Función para manejar el inicio del dibujo
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

  // Función para manejar el movimiento del mouse (para dibujar la forma)
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

  // Función para manejar cuando se termina de dibujar la forma
  const handleMouseUp = () => {
    setDrawing(false);

    // Ajustar las coordenadas de la región seleccionada a las dimensiones originales de la imagen
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

    onRegionSelected(shapeType, adjustedShapeProps, adjustedPoints); // Enviar al padre
  };

  // Dibujar la forma seleccionada
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
      {/* Radio para seleccionar la forma */}
      <div className="field" style={{ marginBottom: "20px" }}>
        <label className="label">Selecciona una forma:</label>
        <div className="control">
          <label className="radio pr-4">
            <input
              type="radio"
              value="rect"
              checked={shapeType === "rect"}
              onChange={() => setShapeType("rect")}
            />
            Rectángulo
          </label>
          <label className="radio pr-4">
            <input
              type="radio"
              value="circle"
              checked={shapeType === "circle"}
              onChange={() => setShapeType("circle")}
            />
            Círculo
          </label>
          <label className="radio">
            <input
              type="radio"
              value="polygon"
              checked={shapeType === "polygon"}
              onChange={() => setShapeType("polygon")}
            />
            Polígono
          </label>
        </div>
      </div>

      {/* Lienzo para la imagen y las formas */}
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