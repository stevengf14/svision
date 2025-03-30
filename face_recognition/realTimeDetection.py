from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
from keras_facenet import FaceNet
from scipy.spatial.distance import euclidean
from service import (
    load_embeddings,
    insert_person,
    update_person,
    delete_person,
    get_all_names,
    get_by_name,
    get_by_id,
    get_cover_image
)

# Configuración para optimización de rendimiento
FRAME_RESIZE_FACTOR = 0.5
PROCESS_EVERY_N_FRAMES = 3
RECOGNITION_TOLERANCE = 1  # Umbral de distancia para FaceNet

# Inicializar Flask y CORS
app = Flask(__name__)
CORS(app)

# Cargar modelos
model = YOLO('yolov8x.pt')
facenet_model = FaceNet()

# Variables globales
capture = False
cap = None
known_face_embeddings, known_face_names = load_embeddings()

# Puntos de control para verificar la carga de embeddings
print(f"Embeddings cargados: {len(known_face_embeddings)}")
print(f"Nombres cargados: {known_face_names}")


def normalize_embedding(embedding):
    """
    Normaliza un embedding para que tenga una magnitud unitaria.
    """
    norm = np.linalg.norm(embedding)
    if norm == 0:
        return embedding
    return embedding / norm


def load_embeddings():
    """
    Carga todos los embeddings y nombres desde la base de datos.
    """
    collection = db["known_faces"]
    embeddings = []
    names = []
    for doc in collection.find():
        for key, embedding in doc.get("embedding", {}).items():
            embeddings.append(normalize_embedding(embedding))  # Normalizar embeddings
            names.append(doc["name"])
    print(f"Se cargaron {len(names)} rostros desde la base de datos.")
    print("Embeddings conocidos (primeros valores):")
    for i, embedding in enumerate(embeddings):
        print(f"Embedding {i + 1}: {embedding[:5]}...")
    return embeddings, names


def detect_faces_with_yolo(frame):
    """
    Detecta rostros en el frame usando YOLOv8.
    """
    results = model(frame)
    detections = []
    for result in results[0].boxes.data.tolist():
        x1, y1, x2, y2, conf, cls = result
        if int(cls) == 0:  # Clase 0 para rostros
            detections.append((int(x1), int(y1), int(x2 - x1), int(y2 - y1)))
    return detections


def generate_embedding(face_region):
    """
    Genera el embedding de un rostro usando FaceNet.
    """
    try:
        face_region_rgb = cv2.cvtColor(face_region, cv2.COLOR_BGR2RGB)
        embedding = facenet_model.embeddings([face_region_rgb])[0]
        embedding = normalize_embedding(embedding)  # Normalizar el embedding generado
        if len(embedding) != 512:
            raise ValueError(f"El embedding generado tiene una longitud inesperada: {len(embedding)}")
        print(f"Embedding generado (primeros valores): {embedding[:5]}...")
        return embedding
    except Exception as e:
        print(f"Error al generar embedding: {e}")
        return None

def compare_embeddings(embedding1, embedding2, tolerance):
    """
    Compara dos embeddings y determina si son similares dentro de un umbral de tolerancia.
    """
    distance = euclidean(embedding1, embedding2)
    print(f"Distancia calculada: {distance}")  # Punto de control para verificar la distancia
    return distance <= tolerance, distance


def process_face(face, frame):
    """
    Procesa un rostro individual: genera el embedding y compara con rostros conocidos.
    """
    x, y, w, h = face
    x_orig, y_orig, w_orig, h_orig = [int(coord / FRAME_RESIZE_FACTOR) for coord in (x, y, w, h)]
    face_region = frame[y_orig:y_orig+h_orig, x_orig:x_orig+w_orig]

    try:
        embedding = generate_embedding(face_region)
        if embedding is None:
            return None

        best_match_name = "Desconocido"
        best_match_distance = float("inf")
        for known_embedding, name in zip(known_face_embeddings, known_face_names):
            is_match, distance = compare_embeddings(embedding, known_embedding, RECOGNITION_TOLERANCE)
            print(f"Comparando con {name}: distancia = {distance}, match = {is_match}")
            if is_match and distance < best_match_distance:
                best_match_name = name
                best_match_distance = distance

        print(f"Mejor coincidencia: {best_match_name} con distancia {best_match_distance}")
        return (x_orig, y_orig, w_orig, h_orig, best_match_name)
    except Exception as e:
        print(f"Error al procesar el rostro: {e}")
        return None


def detect_video():
    """
    Transmite el video en tiempo real con detección facial.
    """
    global capture, cap
    while True:
        if not capture or cap is None:
            continue

        success, frame = cap.read()
        if not success:
            break

        small_frame = cv2.resize(frame, (0, 0), fx=FRAME_RESIZE_FACTOR, fy=FRAME_RESIZE_FACTOR)
        faces = detect_faces_with_yolo(small_frame)

        for face in faces:
            result = process_face(face, frame)
            if result:
                x_orig, y_orig, w_orig, h_orig, name = result
                cv2.rectangle(frame, (x_orig, y_orig), (x_orig + w_orig, y_orig + h_orig), (0, 255, 0), 2)
                cv2.putText(frame, name, (x_orig, y_orig - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """
    Endpoint para transmitir el video en tiempo real.
    """
    return Response(detect_video(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/start', methods=['POST'])
def start_capture():
    """
    Inicia la captura de video.
    """
    global capture, cap
    if cap is None or not cap.isOpened():
        cap = cv2.VideoCapture(0)
    capture = True
    return jsonify({"message": "Captura iniciada", "status": "success"})


@app.route('/stop', methods=['POST'])
def stop_capture():
    """
    Detiene la captura de video.
    """
    global capture, cap
    if cap is not None:
        cap.release()
        cap = None
    capture = False
    return jsonify({"message": "Captura detenida", "status": "success"})



@app.route('/add_person', methods=['POST'])
def add_person_endpoint():
    """
    Agrega una nueva persona a la base de datos.
    """
    person_id = request.form.get('person_id')
    name = request.form.get('name')
    image = request.files.get('image')

    if not person_id or not name or not image:
        return jsonify({"error": "Faltan datos (person_id, name o imagen)."}), 400

    # Procesar la imagen y generar el embedding
    img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
    embedding = generate_embedding(img)

    if embedding is None:
        return jsonify({"error": "No se pudo generar el embedding."}), 500

    # Insertar la persona en la base de datos
    try:
        insert_person(int(person_id), name, embedding.tolist())
        return jsonify({"message": "Persona agregada con éxito."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add_embedding', methods=['POST'])
def add_embedding_endpoint():
    """
    Agrega un nuevo embedding a una persona existente.
    """
    person_id = request.form.get('person_id')
    image = request.files.get('image')

    if not person_id or not image:
        return jsonify({"error": "Faltan datos (person_id o imagen)."}), 400

    # Procesar la imagen y generar el embedding
    img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
    embedding = generate_embedding(img)

    if embedding is None:
        return jsonify({"error": "No se pudo generar el embedding."}), 500

    # Actualizar la persona con el nuevo embedding
    try:
        update_person(int(person_id), embedding=embedding.tolist())
        return jsonify({"message": "Embedding agregado con éxito."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_all_names', methods=['GET'])
def get_all_names_endpoint():
    """
    Devuelve una lista de todas las personas registradas en la base de datos.
    """
    try:
        names = get_all_names()
        return jsonify({"status": "success", "data": names}), 200
    except Exception as e:
        print(f"Error al obtener los nombres: {e}")
        return jsonify({"status": "error", "message": str(e), "data": []}), 500

@app.route('/delete_person', methods=['POST'])
def delete_person_endpoint():
    """
    Elimina una persona de la base de datos.
    """
    person_id = request.form.get('person_id')

    if not person_id:
        return jsonify({"error": "Falta el ID de la persona."}), 400

    try:
        delete_person(int(person_id))
        return jsonify({"message": "Persona eliminada con éxito."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)