import React, { useState } from "react";
import faceRecognitionService from "../../services/faceRecognitionService";

const TrainPerson = ({ person, onClose, onPersonDeleted }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a URL to show the thumbnail
    }
  };

  // Add an embedding for the person
  const addEmbedding = async () => {
    try {
      const formData = new FormData();
      formData.append("person_id", person.id);
      formData.append("image", image);
      await faceRecognitionService.addEmbedding(formData); // Call the correct service
      alert("Embedding added successfully.");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding embedding:", error);
      alert("There was an error adding the embedding.");
    }
  };

  // Delete the person
  const deletePerson = async () => {
    try {
      await faceRecognitionService.deletePerson(person.id); // Call the correct service
      alert(`Person ${person.name} deleted successfully.`);
      onPersonDeleted(); // Reload names in the main component
      onClose(); // Close the component
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("There was an error deleting the person.");
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary">
          <p className="modal-card-title has-text-white">
            Train Algorithm: {person.name}
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Cover</label>
            <figure className="image is-128x128">
              <img
                src={`data:image/jpeg;base64,${person.cover_image}`}
                alt={person.name}
              />
            </figure>
          </div>
          <div className="field">
            <label className="label">Upload Image for Embedding</label>
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
            onClick={addEmbedding}
            disabled={!image}
          >
            Add Embedding
          </button>
          <button className="button is-danger mt-4" onClick={deletePerson}>
            Delete Person
          </button>
        </section>
      </div>
    </div>
  );
};

export default TrainPerson;