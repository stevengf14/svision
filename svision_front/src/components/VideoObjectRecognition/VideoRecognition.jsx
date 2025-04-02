import React, { useState, useEffect } from "react";
import ProcessedVideos from "./ProcessedVideos";
import "utils/global.css";
import videoDetection from "../../services/videoObjectService";
import Select from "react-select";
import { objectArray } from "./names.ts";
import { OBJECT_DETECTION, OPERATION_LABEL, SELECT_TITLE } from "utils/Constants.jsx";
import SideBar from "components/common/Sidebar";
import ActionButton from "components/common/ActionButton";

const VideoRecognition = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [display, setDisplay] = useState("none");

  const [isLoading, setIsLoading] = useState(false);

  // Iniciar la detección de video
  const startCapture = async () => {
    setIsLoading(true);
    const res = await videoDetection.startCapture();
    setIsLoading(false);
    setIsCapturing(true);
  };

  // Detener la detección de video
  const stopCapture = async () => {
    setIsCapturing(false);
    const res = await videoDetection.stopCapture();
  };

  // Seleccionar el objeto a detectar
  const selectObjectAction = async (object) => {
    await videoDetection.setObject(object);
  };

  // Mostrar el video cuando la detección está activa
  useEffect(() => {
    setDisplay(isCapturing ? "block" : "none");
  }, [isCapturing]);

  return (
    <div className="container has-background-dark has-text-light p-5">
      {/* Contenedor del video y tarjeta de información */}
      <div className="columns mt-1">
        {/* Video procesado */}
        <div className="column is-7">
          <ProcessedVideos
            isVideoProcess={isCapturing}
            display={display}
            isLoading={isLoading}
          />
        </div>

        <div className="column is-5">
          <div className="card">
            <div className="card-header has-background-primary">
              <p className="card-header-title has-text-white">
                <i className="fas mr-2"></i> {OPERATION_LABEL}
              </p>
            </div>
            <div className="card-content">
              {/* Selector de objetos */}
              <div className="field is-flex is-align-items-center">
                <label className="label has-text-white mr-3">
                  {SELECT_TITLE}
                </label>
                <div className="select-container">
                  <Select
                    className="select_control"
                    classNamePrefix="select"
                    defaultValue={objectArray[0]}
                    isClearable={false}
                    isSearchable={true}
                    name="object"
                    options={objectArray}
                    menuPortalTarget={document.body}
                    onChange={(e) => selectObjectAction(e.value)}
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "18px",
                        padding: "5px",
                      }),
                    }}
                  />
                </div>
              </div>
              {/* Botones de control */}
              <ActionButton
                isCapturing={isCapturing}
                isLoading={isLoading}
                startCapture={startCapture}
                stopCapture={stopCapture}
              />
            </div>
          </div>
          {/* Tarjeta de Información */}
          <SideBar view={OBJECT_DETECTION}/>
        </div>
      </div>
    </div>
  );
};

export default VideoRecognition;
