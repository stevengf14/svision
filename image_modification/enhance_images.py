import os
import cv2
import torch
import numpy as np
from realesrgan import RealESRGAN


def load_model():
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = RealESRGAN(device, scale=4)
    model.load_weights('models/RealESRGAN_x4plus.pth')
    return model


def enhance_images(input_folder):
    output_folder = os.path.join(input_folder, 'high_def')
    os.makedirs(output_folder, exist_ok=True)

    model = load_model()

    for file_name in os.listdir(input_folder):
        if file_name.lower().endswith(('png', 'jpg', 'jpeg')):
            img_path = os.path.join(input_folder, file_name)
            img = cv2.imread(img_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            sr_img = model.enhance(img)

            output_path = os.path.join(output_folder, file_name)
            cv2.imwrite(output_path, cv2.cvtColor(sr_img, cv2.COLOR_RGB2BGR))
            print(f'Imagen mejorada guardada en: {output_path}')


def main():
    input_folder = input('Ingrese la ruta de la carpeta con imágenes: ')
    if os.path.isdir(input_folder):
        enhance_images(input_folder)
        print('Proceso completado.')
    else:
        print('Error: La carpeta ingresada no existe.')


if __name__ == '__main__':
    main()
