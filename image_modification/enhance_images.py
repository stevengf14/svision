import os
import subprocess
from tkinter import Tk, filedialog, messagebox
from PIL import Image
import sys


def get_executable_path():
    """Obtiene la ruta del ejecutable realesrgan-ncnn-vulkan.exe."""
    if hasattr(sys, '_MEIPASS'):
        # Ruta cuando se ejecuta como .exe
        return os.path.join(sys._MEIPASS, 'tools', 'realesrgan-ncnn-vulkan.exe')
    else:
        # Ruta cuando se ejecuta como script
        return os.path.join('tools', 'realesrgan-ncnn-vulkan.exe')


def convert_to_png(image_path):
    """Convierte una imagen a formato PNG si no lo está."""
    if not image_path.lower().endswith('.png'):
        img = Image.open(image_path)
        png_path = os.path.splitext(image_path)[0] + '.png'
        img.save(png_path, 'PNG')
        return png_path
    return image_path


def process_images(input_folder):
    """Procesa todas las imágenes de una carpeta usando realesrgan-ncnn-vulkan.exe."""
    # Ruta al ejecutable
    exe_path = get_executable_path()
    if not os.path.exists(exe_path):
        messagebox.showerror("Error", f"No se encontró el ejecutable en: {exe_path}")
        return

    # Crear la carpeta de salida
    output_folder = os.path.join(os.path.dirname(input_folder), 'high_quality_images')
    os.makedirs(output_folder, exist_ok=True)

    # Procesar cada imagen en la carpeta de entrada
    for file_name in os.listdir(input_folder):
        if file_name.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'tiff')):
            input_path = os.path.join(input_folder, file_name)
            print(f"Procesando: {input_path}")

            # Convertir a PNG si es necesario
            input_path = convert_to_png(input_path)

            # Nombre de la imagen de salida
            output_path = os.path.join(output_folder, os.path.basename(input_path))

            # Ejecutar el comando realesrgan-ncnn-vulkan.exe
            command = [
                exe_path,
                '-i', input_path,
                '-o', output_path,
                '-n', 'realesrgan-x4plus',  # Modelo a usar
                '-s', '4'  # Escalado fijo a 4
            ]
            try:
                subprocess.run(command, check=True)
                print(f"Imagen procesada guardada en: {output_path}")
            except subprocess.CalledProcessError as e:
                print(f"Error al procesar {input_path}: {e}")

    messagebox.showinfo("Proceso completado", f"Las imágenes mejoradas se guardaron en:\n{output_folder}")


def main():
    """Selecciona una carpeta y procesa las imágenes."""
    # Crear una ventana de selección de carpeta usando tkinter
    root = Tk()
    root.withdraw()  # Ocultar la ventana principal de tkinter
    root.attributes('-topmost', True)  # Asegurarse de que el diálogo esté en primer plano

    input_folder = filedialog.askdirectory(title="Seleccione la carpeta con imágenes")
    if input_folder:
        if os.path.isdir(input_folder):
            process_images(input_folder)
        else:
            messagebox.showerror("Error", "La carpeta seleccionada no es válida.")
    else:
        messagebox.showinfo("Cancelado", "No se seleccionó ninguna carpeta.")


if __name__ == '__main__':
    main()