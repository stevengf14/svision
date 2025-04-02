import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { isMobile } from "react-device-detect";
import { SIDEBAR_INFO, START_VIDEO, STOP_VIDEO } from "utils/Constants";

const SideBar = ({ view }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div>
      <div className="card">
        <div className="card-header has-background-primary">
          <p className="card-header-title has-text-white">
            <i className="fas fa-info-circle mr-2"></i> Information
          </p>
          {isMobile && (
            <button
              className="button is-small mr-3"
              style={{
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
              }}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <FaPlus /> : <FaMinus />}
            </button>
          )}
        </div>
        {!isCollapsed && (
          <div className="card-content">
            <ul className="content">
              <li>
                Click <strong>"{START_VIDEO}"</strong> to begin detection.
              </li>
              <li>Position yourself in front of the camera.</li>
              <li>{SIDEBAR_INFO[view]}</li>
              <li>
                Click <strong>"{STOP_VIDEO}"</strong> when finished.
              </li>
            </ul>
            <div className="notification  mt-4">
              <i className="fas fa-lightbulb mr-2"></i>
              <strong>Tip:</strong> Ensure good lighting and a front-facing
              image for best results.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
