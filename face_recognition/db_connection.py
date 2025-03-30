from pymongo import MongoClient

def get_database():
    """
    Establece la conexión con la base de datos MongoDB.
    """
    # Cambia la URI según tu configuración de MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client["face_recognition_db"]  # Nombre de la base de datos
    return db