import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import BorderDetection from "./components/BorderDetection/BorderDetection";
import "@fortawesome/fontawesome-free/css/all.min.css";
import VideoObjetRecognition from "./components/VideoObjectRecognition/VideoObjetRecognition";

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/border-detection" element={<BorderDetection />} />
          <Route path="/video-object-detection-recognition" element={<VideoObjetRecognition />} />

          
          {/* Add more routes here for future functionalities */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
