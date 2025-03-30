import React, { useState } from "react";
import faceRecognitionService from "../../services/faceRecognitionService";

const TrainPerson = ({ person, onClose, onPersonDeleted }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Manejar la selección de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Crear una URL para mostrar la miniatura
    }
  };

  // Agregar un embedding para la persona
  const addEmbedding = async () => {
    try {
      const formData = new FormData();
      formData.append("person_id", person.id);
      formData.append("image", image);
      await faceRecognitionService.addEmbedding(formData); // Llamar al servicio correcto
      alert("Embedding agregado con éxito.");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error al agregar embedding:", error);
      alert("Hubo un error al agregar el embedding.");
    }
  };

  // Eliminar a la persona
  const deletePerson = async () => {
    try {
      await faceRecognitionService.deletePerson(person.id); // Llamar al servicio correcto
      alert(`Persona ${person.name} eliminada con éxito.`);
      onPersonDeleted(); // Recargar nombres en el componente principal
      onClose(); // Cerrar el componente
    } catch (error) {
      console.error("Error al eliminar persona:", error);
      alert("Hubo un error al eliminar la persona.");
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary">
          <p className="modal-card-title has-text-white">
            Entrenar Algoritmo: {person.name}
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Portada</label>
            <figure className="image is-128x128">
              <img
                src={`data:image/jpeg;base64,${person.cover_image}`}
                alt={person.name}
              />
            </figure>
          </div>
          <div className="field">
            <label className="label">Cargar Imagen para Embedding</label>
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
                  <span className="file-label">Seleccionar Imagen</span>
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
            Agregar Embedding
          </button>
          <button className="button is-danger mt-4" onClick={deletePerson}>
            Eliminar Persona
          </button>
        </section>
      </div>
    </div>
  );
};

export default TrainPerson;