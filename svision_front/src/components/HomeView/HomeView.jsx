import React from "react";
import "utils/global.css";
import InfoCard from "./InfoCards.jsx";
import {
  BORDER_DETECTION,
  FACE_DETECTION,
  HOME_SUBTITLE_TEXT,
  OBJECT_DETECTION,
} from "utils/Constants.jsx";

const HomeView = () => {
  return (
    <div className="container has-background-dark has-text-light p-5">
      <p className="subtitle has-text-info-light pt-4">{HOME_SUBTITLE_TEXT}</p>

      <div className="columns mt-1">
        <div className="column is-4">
          <InfoCard
            title={BORDER_DETECTION}
          />
        </div>
        <div className="column is-4">
          <InfoCard
            title={OBJECT_DETECTION}
          />
        </div>
        <div className="column is-4">
          <InfoCard
            title={FACE_DETECTION}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
