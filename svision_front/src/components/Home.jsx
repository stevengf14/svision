import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      title: "Real-Time Object Detection",
      description: "Utilizes YOLO architectures to process webcam or IP streams on the fly with remarkably low latency.",
      icon: "fa-solid fa-camera",
      link: "/object-detection",
      colorClass: "is-primary"
    },
    {
      title: "Face Embedding Training",
      description: "Generates facial embeddings live. Add new individuals directly from the UI without stopping the service.",
      icon: "fa-solid fa-user-check",
      link: "/face-detection",
      colorClass: "is-info"
    },
    {
      title: "Border Detection",
      description: "Interactive canvas to process regions of interest applying Canny, Sobel, and Laplacian filters.",
      icon: "fa-solid fa-crop-simple",
      link: "/border-detection",
      colorClass: "is-success"
    },
    {
      title: "AI Image Enhancer",
      description: "Integration with Real-ESRGAN upscales lower-resolution media significantly enhancing fidelity.",
      icon: "fa-solid fa-wand-magic-sparkles",
      link: "/image-enhancement",
      colorClass: "is-warning"
    }
  ];

  return (
    <div className="home-container mt-6 px-4 pb-6">
      {/* Hero Section */}
      <section className="hero is-transparent mb-6">
        <div className="hero-body has-text-centered">
          <h1 className="title is-1 has-text-white" style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            SVision <span style={{ color: '#00d2ff' }}>Studio</span>
          </h1>
          <p className="subtitle is-4 mt-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            AI-Powered Computer Vision Suite
          </p>
          <p style={{ maxWidth: "600px", margin: "0 auto", color: 'rgba(255, 255, 255, 0.6)' }}>
            A robust, full-stack application leveraging advanced Computer Vision algorithms for image enhancement and real-time video processing. Select a module below to begin.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <div className="columns is-multiline is-centered">
        {features.map((feature, index) => (
          <div className="column is-12-mobile is-6-tablet is-5-desktop" key={index}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="card-content" style={{ flexGrow: 1 }}>
                <div className="media mb-4" style={{ alignItems: 'center' }}>
                  <div className="media-left">
                    <span 
                      className="icon is-large" 
                      style={{ 
                        fontSize: '2rem', 
                        // Fallback colors if the specific font class color is not applied
                        color: feature.colorClass === 'is-primary' ? '#00d2ff' : 
                               feature.colorClass === 'is-info' ? '#4facfe' : 
                               feature.colorClass === 'is-success' ? '#38ef7d' : '#f8b500'
                      }}
                    >
                      <i className={feature.icon}></i>
                    </span>
                  </div>
                  <div className="media-content" style={{ overflow: 'hidden' }}>
                    <p className="title is-4 has-text-white m-0">{feature.title}</p>
                  </div>
                </div>
                <div className="content mt-3" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {feature.description}
                </div>
              </div>
              <footer className="card-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Link to={feature.link} className={`card-footer-item button ${feature.colorClass} is-fullwidth m-4`} style={{ border: 'none' }}>
                  Launch Module
                </Link>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;