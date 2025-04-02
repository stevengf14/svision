import React from "react";
import HomeView from "./HomeView/HomeView";
import { HOME_TITLE_TEXT } from "../utils/Constants";

const Home = () => {
  return (
    <div className="has-background-dark has-text-light mt-5 p-5">
      <h1 className="title is-1 has-text-info">{HOME_TITLE_TEXT}</h1>
      <HomeView/>
    </div>
  );
};

export default Home;