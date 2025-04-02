import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import BorderDetection from "./components/BorderDetection/BorderDetection";
import "@fortawesome/fontawesome-free/css/all.min.css";
import VideoObjetRecognition from "./components/VideoObjectRecognition/VideoObjetRecognition";
import FaceVideoObjetRecognition from "./components/FaceRecognition/FaceVideoRecognition";
import Footer from "./components/common/Footer";

function App() {
  return (
    <Router>
      <Header />
      <div className="container" style={{ marginBottom: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/border-detection" element={<BorderDetection />} />
          <Route path="/object-detection" element={<VideoObjetRecognition />} />
          <Route path="/face-detection" element={<FaceVideoObjetRecognition />} />
          
          {/* Add more routes here for future functionalities */}
        </Routes>
      </div>
      <Footer />  
    </Router>
  );
}

export default App;
