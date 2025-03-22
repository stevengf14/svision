import os
import subprocess
from datetime import datetime


# Función para escalar videos a 1080p
def scale_videos(carpeta_origen_base, new_width=1920, new_height=1080):
    # Obtiene la fecha de hoy en formato 'YYYY-MM-DD'
    today_date = datetime.now().strftime('%Y-%m-%d')

    # Define la ruta de la carpeta de origen (donde están los videos originales)
    source_folder = os.path.join(carpeta_origen_base, today_date, 'fx')

    # Crea la carpeta '1080p' si no existe
    destination_folder = os.path.join(carpeta_origen_base, today_date, '1080p')
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    # Recorre la carpeta 'fx' buscando videos
    for root_folder, _, files in os.walk(source_folder):
        for file in files:
            # Verifica si el archivo es un video y no tiene ya el sufijo _1080p
            if file.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')) and "_1080p" not in file:
                print(f"Procesando el video: {file}")
                video_path = os.path.join(root_folder, file)

                # Define el nombre del video escalado con el sufijo _1080p
                file_1080p = os.path.splitext(file)[0] + "_1080p" + os.path.splitext(file)[1]
                destination_path = os.path.join(destination_folder, file_1080p)

                # Comando FFmpeg para escalar el video a 1080p manteniendo la calidad
                command = [
                    "ffmpeg",
                    "-i", video_path,  # Archivo de entrada
                    "-vf", f"scale={new_width}:{new_height}",  # Escalar a 1080p
                    "-c:v", "libx264",  # Codec de video
                    "-crf", "18",  # Control de calidad (bajo CRF = mejor calidad)
                    "-preset", "slow",  # Mejor compresión manteniendo calidad
                    "-c:a", "aac", "-b:a", "192k",  # Mantener el audio
                    destination_path
                ]

                # Ejecuta el comando FFmpeg
                result = subprocess.run(command, capture_output=True, text=True, shell=True)

                # Verifica si hubo un error
                if result.returncode != 0:
                    print(f"Error al procesar el video: {file}")
                    print(f"Mensaje de error: {result.stderr}")
                else:
                    print(f'Video escalado y guardado en: {destination_path}')


# Carpeta base donde están los videos (ajústala según tu ruta)
base_folder = r'C:\Steven\IA Images'

# Llamada a la función para escalar los videos
scale_videos(base_folder)
