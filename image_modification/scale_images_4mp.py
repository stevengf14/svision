import os
import shutil
from PIL import Image
from datetime import datetime


# Function to scale images without changing the format
def scale_images(carpeta_origen_base, new_width=4000, new_height=1000):
    # Gets today's date in the format 'YYYY-MM-DD'
    today_date = datetime.now().strftime('%Y-%m-%d')

    # Defines the path for today's specific folder
    source_folder = os.path.join(carpeta_origen_base, today_date, 'fx')

    # Creates the '4MP' folder if it doesn't exist
    destination_folder = os.path.join(carpeta_origen_base, today_date, '4MP')
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    # Loops through the 'fx' folder looking for images
    for root_folder, _, files in os.walk(source_folder):
        for file in files:
            # Checks if the file is a JPG or JPEG image and doesn't have the _4mp suffix
            if (file.lower().endswith('.jpg') or file.lower().endswith('.jpeg')) and "_4mp" not in file:
                image_path = os.path.join(root_folder, file)

                # Opens the image
                img = Image.open(image_path)
                width, height = img.size

                # Maintains the aspect ratio
                aspect_ratio = width / height

                if width > height:
                    # If the width is greater than the height, resize based on width
                    new_width_value = new_width
                    new_height_value = int(new_width_value / aspect_ratio)
                else:
                    # If the height is greater than the width, resize based on height
                    new_height_value = new_height
                    new_width_value = int(new_height_value * aspect_ratio)

                # Resizes the image
                img = img.resize((new_width_value, new_height_value), Image.LANCZOS)

                # Defines the destination path with the _4mp suffix
                file_4mp = os.path.splitext(file)[0] + "_4mp" + os.path.splitext(file)[1]
                destination_path = os.path.join(destination_folder, file_4mp)

                # Saves the resized image in its original format (JPG or JPEG)
                img.save(destination_path)
                print(f'Converted and resized image: {destination_path}')

                # Moves the original image to the 'original' folder (if you want to move it)
                # original_folder_path = os.path.join(original_folder, file)
                # shutil.move(image_path, original_folder_path)
                # print(f'Image moved to original: {original_folder_path}')


# Base folder where the date folders and 'fx' folder are located
base_folder = r'C:\Steven\IA Images'

# Calls the function to scale the images
scale_images(base_folder)
