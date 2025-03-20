import json
import cv2
import numpy as np
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)

def load_image(img_data):
    try:
        img = np.array(bytearray(img_data), dtype=np.uint8)
        img = cv2.imdecode(img, cv2.IMREAD_UNCHANGED)
        if img is None:
            raise ValueError("Could not read the image")
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        if img.dtype in [np.uint16, np.uint64, np.float32, np.float64]:
            img = np.clip(img, 0, 255).astype(np.uint8)
    except Exception as e:
        logging.error(f"Error reading the image: {e}")
        return None
    return img

def ensure_gray(image: np.ndarray) -> np.ndarray:
    if image is None:
        raise ValueError("Image is None.")
    if len(image.shape) == 3:
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return image

def apply_canny(img, threshold1, threshold2):
    image_8u = np.clip(img, 0, 255).astype(np.uint8)
    return cv2.Canny(image_8u, threshold1, threshold2)

def get_canny_borders(img, threshold1, threshold2):
    gray_scale = ensure_gray(img)
    return apply_canny(gray_scale, threshold1, threshold2)

def apply_gaussian_blur(img, seed):
    kernel_size = (seed // 20) * 2 + 1
    return cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)

def auto_canny_threshold(img):
    v = np.median(img)
    sigma = 0.33
    lower_threshold = int(max(0, (1.0 - sigma) * v))
    upper_threshold = int(min(255, (1.0 + sigma) * v))
    return lower_threshold, upper_threshold

def morph_operations(canny_img, seed):
    iterations = seed // 50
    dilated = cv2.dilate(canny_img, None, iterations=iterations)
    return cv2.erode(dilated, None, iterations=iterations)

def create_mask(img, shape_type, shape_props, points):
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    if shape_type == 'rect':
        x, y, width, height = int(shape_props['x']), int(shape_props['y']), int(shape_props['width']), int(shape_props['height'])
        cv2.rectangle(mask, (x, y), (x + width, y + height), 255, -1)
    elif shape_type == 'circle':
        x, y, radius = int(shape_props['x']), int(shape_props['y']), int(shape_props['radius'])
        cv2.circle(mask, (x, y), radius, 255, -1)
    elif shape_type == 'polygon' and points:
        pts = np.array(points, np.int32).reshape((-1, 1, 2))
        cv2.fillPoly(mask, [pts], 255)
    return mask

def process_region(img, mask, threshold1, threshold2, seed):
    region = cv2.bitwise_and(img, img, mask=mask)
    blurred_region = apply_gaussian_blur(region, seed)
    canny_region = get_canny_borders(blurred_region, threshold1, threshold2)
    return cv2.cvtColor(canny_region, cv2.COLOR_GRAY2BGR)

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        file = request.files['image']
        seed = int(request.form['seed'])
        mode = request.form['mode']
        shape_type = request.form.get('shapeType')

        img = load_image(file.read())
        if img is None:
            return jsonify({"error": "Could not process the image."}), 400

        if mode == "object":
            threshold1 = seed
            threshold2 = seed * 2
        elif mode == "background":
            threshold1 = int(seed * 1.5)
            threshold2 = seed * 3
        else:
            return jsonify({"error": "Invalid mode. Use 'object' or 'background'."}), 400

        processed_img = img.copy()

        if shape_type:
            shape_props = json.loads(request.form['shapeProps'])
            points = json.loads(request.form['points']) if 'points' in request.form and request.form['points'] else None

            mask = create_mask(img, shape_type, shape_props, points)
            canny_region_colored = process_region(img, mask, threshold1, threshold2, seed)

            mask_colored = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR) if len(mask.shape) == 2 else mask
            processed_img = cv2.bitwise_and(processed_img, cv2.bitwise_not(mask_colored))
            processed_img = cv2.add(processed_img, canny_region_colored)
        else:
            blurred_image = apply_gaussian_blur(processed_img, seed)
            canny_image = get_canny_borders(blurred_image, threshold1, threshold2)
            processed_img = morph_operations(canny_image, seed)

        _, buffer = cv2.imencode('.jpg', processed_img)
        img_byte_arr = BytesIO(buffer)
        img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

        return jsonify({
            "image_base64": f"data:image/jpeg;base64,{img_base64}",
            "threshold1": threshold1,
            "threshold2": threshold2
        })

    except Exception as e:
        logging.error(f"Error in request: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)