from flask import Flask, render_template, Response, jsonify, request
import cv2
from ultralytics import YOLO
from flask_cors import CORS

# Cargar el modelo YOLOv8 preentrenado
modelo = YOLO("yolov8m.pt")
app = Flask(__name__)
#CORS(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

selected_option = "person"

# Variables universales
capture = False
objects_names = ["person", "cat", "dog", "cell phone"]
cap = None


def detect_video():
    global capture, cap
    while True:
        if not capture or cap is None:
            continue  # Pausar la captura sin cortar el proceso

        success, frame = cap.read()
        if not success:
            break

        # Obtener dimensiones del frame
        altura, ancho, _ = frame.shape

        # Procesar el fotograma y detectar objetos
        resultados = modelo(frame)

        # Dibujar las detecciones en el fotograma
        for resultado in resultados:
            for caja in resultado.boxes:
                x1, y1, x2, y2 = map(int, caja.xyxy[0])  # Coordenadas de la caja
                conf = caja.conf[0].item()  # Confianza del modelo
                clase = int(caja.cls[0].item())  # Clase detectada
                confianza2 = conf * 100
                etiqueta = f"{modelo.names[clase]} {confianza2:.2f}" + "%"  # Etiqueta con confianza

                if modelo.names[clase] in selected_option:
                    # Color dinámico basado en la confianza
                    color = (0, int(255 * conf), int(255 * (1 - conf)))

                    # Dibujar la caja y la etiqueta
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, etiqueta, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        # Codificar la imagen en formato JPEG para enviarla como stream
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        # Retornar el frame en formato adecuado para transmisión HTTP
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


@app.route('/video_feed')
def video_feed():
    # Ruta que transmite el video
    return Response(detect_video(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/start', methods=['POST'])
def start_capture():
    # Inicia la captura de video
    global capture, cap
    print(cap)
    if cap is None or not cap.isOpened():
        print("entro para acs")
        # Encender la cámara
        cap = cv2.VideoCapture(0)
    capture = True
    return jsonify({"message": "Captura iniciada", "status": "success"})
    # return Response(detect_video(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/stop', methods=['POST'])
def stop_capture():
    # Detiene la captura de video
    global capture, cap
    if cap is not None:
        # Apagar la cámara
        cap.release()
        cap = None
        # cv2.destroyAllWindows()
    return jsonify({"message": "Captura detenida", "status": "success"})


@app.route('/get_objects', methods=['GET'])
def get_objects():
    return jsonify({"objects": objects_names})


@app.route('/set_object', methods=['POST'])
def set_object():
    global selected_option
    selected_option = request.json.get('option', 'default')
    print({selected_option})
    return jsonify({"status": "option set", "option": selected_option})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
