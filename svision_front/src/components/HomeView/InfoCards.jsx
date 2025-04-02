import { HOME_DESCRIPTION, HOME_URL, VIEW_MORE } from "utils/Constants";
import React from "react";
import { Link } from "react-router-dom";

const InfoCard = ({ title }) => {

  console.log("InfoCard", title);

  return (
    <div>
      <div className="card">
        <div className="card-header has-background-dark">
          <p className="card-header-title has-text-white">
            <i className="mr-2"></i> {title}
          </p>
        </div>
        <div className="card-content">
          <ul className="content">{HOME_DESCRIPTION[title]}</ul>
          <Link
            className="button is-info is-outlined mt-2"
            to={HOME_URL[title]}
          >
            {VIEW_MORE}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
