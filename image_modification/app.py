import os
import subprocess
import uuid
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'temp_uploads'
PROCESSED_FOLDER = 'temp_processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def get_executable_path():
    return os.path.join(os.path.dirname(__file__), 'tools', 'realesrgan-ncnn-vulkan.exe')

@app.route('/enhance', methods=['POST'])
def enhance_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save temp input
    file_id = str(uuid.uuid4())
    input_ext = os.path.splitext(file.filename)[1] or '.png'
    input_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_input{input_ext}")
    output_path = os.path.join(PROCESSED_FOLDER, f"{file_id}_output.png")
    
    file.save(input_path)

    # Process using Real-ESRGAN
    exe_path = get_executable_path()
    if not os.path.exists(exe_path):
        return jsonify({"error": "AI Executable missing on server."}), 500

    command = [
        exe_path,
        '-i', input_path,
        '-o', output_path,
        '-n', 'realesrgan-x4plus',
        '-s', '4',
        '-f', 'png'
    ]

    try:
        subprocess.run(command, check=True)
        # Send the processed image back
        return send_file(output_path, mimetype='image/png')
    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Model inference failed: {e}"}), 500
    finally:
        # Cleanup input file
        if os.path.exists(input_path):
            try:
                os.remove(input_path)
            except:
                pass

if __name__ == '__main__':
    # Usar puerto 5003 para no chocar con otros servicios
    app.run(port=5003, debug=True)
