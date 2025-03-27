from ultralytics import YOLO
import cv2
import face_recognition
import os
import numpy as np

# Configuración para optimización de rendimiento
FRAME_RESIZE_FACTOR = 0.5  # Reducir el tamaño del frame para procesar menos píxeles
PROCESS_EVERY_N_FRAMES = 3  # Procesar cada N frames para mejorar rendimiento
RECOGNITION_TOLERANCE = 0.6  # Umbral de tolerancia para reconocimiento facial (menor = más estricto)

# Cargar el modelo YOLOv8x preentrenado
model = YOLO('yolov8x.pt')  # Cambia a 'yolov8n.pt', 'yolov8s.pt', etc., según tus necesidades

def load_known_faces(people_folder):
    """
    Carga los rostros conocidos desde la carpeta 'people'.
    """
    known_face_encodings = []
    known_face_names = []

    if not os.path.exists(people_folder):
        os.makedirs(people_folder)
        print(f"Se ha creado la carpeta '{people_folder}'. Por favor, agrega imágenes de personas en subcarpetas con el nombre de cada persona.")
        return known_face_encodings, known_face_names

    for foldername in os.listdir(people_folder):
        folder_path = os.path.join(people_folder, foldername)
        if os.path.isdir(folder_path):
            for filename in os.listdir(folder_path):
                if filename.endswith((".jpg", ".jpeg", ".png")):
                    image_path = os.path.join(folder_path, filename)
                    try:
                        img = face_recognition.load_image_file(image_path)
                        face_encodings = face_recognition.face_encodings(img)
                        if face_encodings:
                            known_face_encodings.append(face_encodings[0])
                            known_face_names.append(foldername)
                            print(f"  - Rostro de {foldername} cargado correctamente")
                            break  # Solo usar la primera imagen válida por persona
                    except Exception as e:
                        print(f"  - Error al procesar {image_path}: {e}")
    print(f"Se cargaron {len(known_face_names)} rostros para reconocimiento facial")
    return known_face_encodings, known_face_names

def detect_faces_with_yolo(frame):
    """
    Detecta rostros en el frame usando YOLOv8.
    """
    results = model(frame)
    detections = []
    for result in results[0].boxes.data.tolist():
        x1, y1, x2, y2, conf, cls = result
        if int(cls) == 0:  # Clase 0 para rostros (asegúrate de que el modelo esté entrenado para esto)
            detections.append((int(x1), int(y1), int(x2 - x1), int(y2 - y1)))
    return detections

def draw_label(frame, text, x, y, w, h):
    """
    Dibuja un cuadro con texto sobre el rostro detectado.
    """
    # Fondo semitransparente para el texto
    overlay = frame.copy()
    cv2.rectangle(overlay, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Cuadro del rostro
    cv2.rectangle(overlay, (x, y - 30), (x + w, y), (0, 255, 0), -1)  # Fondo del texto
    alpha = 0.6
    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

    # Texto
    cv2.putText(frame, text, (x + 5, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error al abrir la cámara")
        return

    # Cargar rostros conocidos
    people_folder = "people"
    known_face_encodings, known_face_names = load_known_faces(people_folder)

    print("Presiona 'q' para salir")

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error al leer el frame")
            break

        # Redimensionar el frame para mejorar el rendimiento
        small_frame = cv2.resize(frame, (0, 0), fx=FRAME_RESIZE_FACTOR, fy=FRAME_RESIZE_FACTOR)

        # Procesar cada N frames
        frame_count += 1
        if frame_count % PROCESS_EVERY_N_FRAMES != 0:
            continue

        # Detectar rostros con YOLO
        faces = detect_faces_with_yolo(small_frame)

        # Procesar cada rostro detectado
        for (x, y, w, h) in faces:
            # Escalar las coordenadas al tamaño original
            x_orig, y_orig, w_orig, h_orig = [int(coord / FRAME_RESIZE_FACTOR) for coord in (x, y, w, h)]

            # Extraer la región del rostro en el frame original
            face_region = frame[y_orig:y_orig+h_orig, x_orig:x_orig+w_orig]
            face_region_rgb = cv2.cvtColor(face_region, cv2.COLOR_BGR2RGB)

            # Codificar rostro
            face_encodings = face_recognition.face_encodings(face_region_rgb)
            if face_encodings:
                face_encoding = face_encodings[0]
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if face_distances[best_match_index] <= RECOGNITION_TOLERANCE:
                    name = known_face_names[best_match_index]
                else:
                    name = "Desconocido"

                # Dibujar el rostro y el nombre en el frame original
                draw_label(frame, name, x_orig, y_orig, w_orig, h_orig)

        # Mostrar el frame
        cv2.imshow("Detección Facial con YOLO", frame)

        # Salir al presionar 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()