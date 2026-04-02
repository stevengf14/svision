import React, { useState, useEffect } from "react";
import ProcessedVideos from "./ProcessedVideos";
import "./style.css";
import faceRecognitionService from "../../services/faceRecognitionService";
import ClipLoader from "react-spinners/ClipLoader";
import { START_VIDEO, STOP_VIDEO } from "../Constants.jsx";
import SideBar from "./Sidebar.jsx";
import TrainPerson from "./TrainPerson"; // Importar el componente de entrenamiento

const FaceRecognition = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [display, setDisplay] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState([]);
  const [newPerson, setNewPerson] = useState({ id: "", name: "", image: null });
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // To show the image thumbnail
  const [showTrainPerson, setShowTrainPerson] = useState(false); // Controlar la ventana de entrenamiento

  // Load names from the database
  const loadNames = async () => {
    try {
      const res = await faceRecognitionService.getAllNames();
      if (res.status === "success") {
        setNames(Array.isArray(res.data) ? res.data : []); // Ensure names is an array
      } else {
        console.error("Error loading names:", res.message);
        setNames([]); // Default to empty array on error
      }
    } catch (error) {
      console.error("Error loading names:", error);
      setNames([]); // Default to empty array on error
    }
  };

  useEffect(() => {
    loadNames();
  }, []);

  // Iniciar la detección de video
  const startCapture = async () => {
    setIsLoading(true);
    await faceRecognitionService.startCapture();
    setIsLoading(false);
    setIsCapturing(true);
  };

  // Detener la detección de video
  const stopCapture = async () => {
    setIsCapturing(false);
    await faceRecognitionService.stopCapture();
  };

  // Add a new person
  const addPerson = async () => {
    const formData = new FormData();
    formData.append("person_id", newPerson.id);
    formData.append("name", newPerson.name);
    formData.append("image", newPerson.image);
    await faceRecognitionService.addPerson(formData);
    setNewPerson({ id: "", name: "", image: null });
    setImagePreview(null); // Clear thumbnail
    setShowAddPersonForm(false);
    loadNames(); // Reload the list of people
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPerson({ ...newPerson, image: file });
      setImagePreview(URL.createObjectURL(file)); // Create a URL to show the thumbnail
    }
  };

  // Mostrar el video cuando la detección está activa
  useEffect(() => {
    setDisplay(isCapturing ? "block" : "none");
  }, [isCapturing]);

  return (
    <div className="container has-background-dark has-text-light p-5">
      <div className="columns mt-1">
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
                <i className="fas mr-2"></i> Operations
              </p>
            </div>
            <div className="card-content">
              <button
                className="button is-success mt-2"
                onClick={() => setShowAddPersonForm(!showAddPersonForm)}
              >
                {showAddPersonForm ? "Cancel" : "Add Person"}
              </button>
              {showAddPersonForm && (
                <div className="mt-4">
                  <div className="field">
                    <label className="label has-text-white">ID</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="ID"
                      value={newPerson.id}
                      onChange={(e) =>
                        setNewPerson({ ...newPerson, id: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label className="label has-text-white">Name</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Name"
                      value={newPerson.name}
                      onChange={(e) =>
                        setNewPerson({ ...newPerson, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label className="label has-text-white">Photo</label>
                    <div className="file has-name is-boxed">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <i className="fas fa-upload"></i>
                          </span>
                          <span className="file-label">Select Image</span>
                        </span>
                      </label>
                    </div>
                    {imagePreview && (
                      <figure className="image is-128x128 mt-3">
                        <img src={imagePreview} alt="Preview" />
                      </figure>
                    )}
                  </div>
                  <button
                    className="button is-success mt-2"
                    onClick={addPerson}
                    disabled={!newPerson.id || !newPerson.name || !newPerson.image}
                  >
                    Save Person
                  </button>
                </div>
              )}
              <div className="columns mt-2 mb-2 is-centered">
                <div className="field is-flex is-align-items-center">
                  <button
                    className="button is-info mr-3"
                    onClick={startCapture}
                    disabled={isCapturing || isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader
                        color={"#ffffff"}
                        loading={isLoading}
                        size={20}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        className="mr-2"
                      />
                    ) : (
                      <i className="fas fa-play mr-2" />
                    )}
                    {START_VIDEO}
                  </button>
                  <button
                    className="button is-danger"
                    onClick={stopCapture}
                    disabled={!isCapturing}
                  >
                    <i className="fas fa-stop mr-2" /> {STOP_VIDEO}
                  </button>
                </div>
              </div>
              <div className="field">
                <label className="label has-text-white">Known People</label>
                <ul>
                  {Array.isArray(names) && names.length > 0 ? (
                    names.map((person) => (
                      <li
                        key={person.id}
                        onClick={() => setSelectedPerson(person)}
                        className={`pointer ${
                          selectedPerson?.id === person.id
                            ? "has-text-primary"
                            : ""
                        }`}
                      >
                        {person.name}
                      </li>
                    ))
                  ) : (
                    <p className="has-text-light">No people registered.</p>
                  )}
                </ul>
              </div>
              {selectedPerson && (
                <div className="mt-4">
                  <p>
                    Selected person:{" "}
                    <strong>{selectedPerson.name}</strong>
                  </p>
                  <button
                    className="button is-warning mt-2"
                    onClick={() => setShowTrainPerson(true)}
                  >
                    Train Algorithm
                  </button>
                </div>
              )}
            </div>
          </div>
          <SideBar />
        </div>
      </div>

      {/* Show the training component */}
      {showTrainPerson && selectedPerson && (
        <TrainPerson
          person={selectedPerson}
          onClose={() => setShowTrainPerson(false)}
          onPersonDeleted={loadNames} // Reload names if a person is deleted
        />
      )}
    </div>
  );
};

export default FaceRecognition;