import os
from PIL import Image


# Función para convertir las imágenes
def convertir_imagenes(carpeta_origen):
    # Recorre la carpeta y sus subcarpetas
    for carpeta_raiz, _, archivos in os.walk(carpeta_origen):
        for archivo in archivos:
            # Check if the file is a JPG image
            if archivo.lower().endswith('.jpg') or archivo.lower().endswith('.jpeg'):
                ruta_imagen = os.path.join(carpeta_raiz, archivo)

                # Open the image
                img = Image.open(ruta_imagen)

                # Define la ruta de destino con el mismo nombre pero extensión .png
                ruta_destino_png = os.path.splitext(ruta_imagen)[0] + '.png'

                # Save the image in PNG format
                img.save(ruta_destino_png, 'PNG')
                print(f'Image converted: {ruta_destino_png}')


# Carpeta origen (solo necesitas dar la ruta a la carpeta)
carpeta_origen = 'C:\Steven\Adobe Stock\IA\\Nature'

# Llama a la función para convertir las imágenes
convertir_imagenes(carpeta_origen)
