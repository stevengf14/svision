import cv2
import numpy as np
import logging
import os
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
import base64
from io import BytesIO

# Configurar Flask
app = Flask(__name__)
CORS(app)  # Permite CORS para todas las rutas

# Funciones de procesamiento de imágenes (con optimizaciones)
def load_image(img_data):
    try:
        # Convertir la imagen en un arreglo numpy
        img = np.array(bytearray(img_data), dtype=np.uint8)
        img = cv2.imdecode(img, cv2.IMREAD_UNCHANGED)
        if img is None:
            raise ValueError("No se pudo leer la imagen")
        if len(img.shape) == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        if img.dtype in [np.uint16, np.uint64, np.float32, np.float64]:
            img = np.clip(img, 0, 255).astype(np.uint8)
    except Exception as e:
        logging.error(f"Error al leer la imagen: {e}")
        return None
    return img

def ensure_gray(image: np.ndarray) -> np.ndarray:
    if image is None:
        raise ValueError("La imagen es None.")
    if len(image.shape) == 3:
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return image

def apply_canny(img, threshold1, threshold2):
    image_8u = np.clip(img, 0, 255).astype(np.uint8)
    return cv2.Canny(image_8u, threshold1, threshold2)

def get_canny_borders(img, threshold1, threshold2):
    gray_scale = ensure_gray(img)
    canny = apply_canny(gray_scale, threshold1, threshold2)
    return canny

# Función para aplicar Gaussian Blur
def apply_gaussian_blur(img):
    return cv2.GaussianBlur(img, (5, 5), 0)

# Función para obtener los umbrales de Canny de forma automática
def auto_canny_threshold(img):
    v = np.median(img)
    sigma = 0.33
    lower_threshold = int(max(0, (1.0 - sigma) * v))
    upper_threshold = int(min(255, (1.0 + sigma) * v))
    return lower_threshold, upper_threshold

# Función para operaciones morfológicas (dilatación y erosión)
def morph_operations(canny_img):
    dilated = cv2.dilate(canny_img, None, iterations=1)
    eroded = cv2.erode(dilated, None, iterations=1)
    return eroded

# Ruta para recibir la imagen y los parámetros
@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        # Obtener los datos de la petición
        file = request.files['image']  # Imagen subida desde el frontend
        seed = int(request.form['seed'])  # Valor de seed
        mode = request.form['mode']  # Modo ("object" o "background")

        # Leer la imagen
        img = load_image(file.read())
        if img is None:
            return jsonify({"error": "No se pudo procesar la imagen."}), 400

        # Establecer umbrales dependiendo del modo
        if mode == "object":
            threshold1 = seed
            threshold2 = seed * 3
        elif mode == "background":
            threshold1 = seed * 2
            threshold2 = seed * 5
        else:
            return jsonify({"error": "Modo no válido. Use 'object' o 'background'."}), 400

        # Aplica Gaussian Blur
        blurred_image = apply_gaussian_blur(img)

        # Obtiene los umbrales automáticos (si prefieres usar esto)
        # threshold1, threshold2 = auto_canny_threshold(blurred_image)

        # Procesar la imagen con Canny usando los umbrales definidos
        canny_image = get_canny_borders(blurred_image, threshold1, threshold2)

        # Realizar operaciones morfológicas para refinar los bordes
        refined_image = morph_operations(canny_image)

        # Convertir la imagen de bordes refinada a formato base64
        _, buffer = cv2.imencode('.jpg', refined_image)
        img_byte_arr = BytesIO(buffer)
        img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

        # Devolver la imagen procesada como respuesta JSON
        return jsonify({
            "image_base64": f"data:image/jpeg;base64,{img_base64}",
            "threshold1": threshold1,
            "threshold2": threshold2
        })

    except Exception as e:
        logging.error(f"Error en la solicitud: {e}")
        return jsonify({"error": str(e)}), 500

# Iniciar el servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
