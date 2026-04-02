import os
import subprocess
import threading
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import sys

def get_executable_path():
    """Obtiene la ruta del ejecutable realesrgan-ncnn-vulkan.exe."""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, 'tools', 'realesrgan-ncnn-vulkan.exe')
    else:
        return os.path.join(os.path.dirname(__file__), 'tools', 'realesrgan-ncnn-vulkan.exe')

class ImageEnhancerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("SVision AI Enhancer (Personal)")
        self.root.geometry("450x250")
        self.root.resizable(False, False)
        
        # UI Styling
        style = ttk.Style()
        style.configure("TButton", font=("Segoe UI", 10), padding=5)
        style.configure("TLabel", font=("Segoe UI", 11))

        self.label = ttk.Label(root, text="Select a folder of images to enhance using AI.", justify="center")
        self.label.pack(pady=20)

        self.btn_select = ttk.Button(root, text="Select Folder", command=self.select_folder)
        self.btn_select.pack(pady=10)

        self.status_var = tk.StringVar()
        self.status_var.set("Idle.")
        self.status_label = ttk.Label(root, textvariable=self.status_var, font=("Segoe UI", 9, "italic"))
        self.status_label.pack(pady=10)
        
        self.progress = ttk.Progressbar(root, orient="horizontal", length=300, mode="indeterminate")

    def select_folder(self):
        input_folder = filedialog.askdirectory(title="Seleccione la carpeta con imágenes")
        if input_folder:
            self.btn_select.config(state="disabled")
            self.progress.pack(pady=10)
            self.progress.start()
            self.status_var.set("Processing folder in batch mode... Please wait.")
            
            # Run processing in a background thread to keep UI responsive
            threading.Thread(target=self.process_images, args=(input_folder,), daemon=True).start()

    def process_images(self, input_folder):
        exe_path = get_executable_path()
        if not os.path.exists(exe_path):
            self.finish_processing(f"Error: Executable not found at {exe_path}", success=False)
            return

        output_folder = os.path.join(os.path.dirname(input_folder), 'SVision_Enhanced_Images')
        os.makedirs(output_folder, exist_ok=True)

        command = [
            exe_path,
            '-i', input_folder,
            '-o', output_folder,
            '-n', 'realesrgan-x4plus',
            '-s', '4',
            '-f', 'png'
        ]

        try:
            # Batch mode run (letting the C++ executable handle the entire folder efficiently)
            subprocess.run(command, check=True)
            self.finish_processing(f"Optimization complete! Saved to:\n{output_folder}", success=True, out_dir=output_folder)
        except subprocess.CalledProcessError as e:
            self.finish_processing(f"Error executing AI model: {e}", success=False)
        except Exception as e:
            self.finish_processing(f"Unexpected error: {e}", success=False)

    def finish_processing(self, message, success, out_dir=None):
        self.progress.stop()
        self.progress.pack_forget()
        self.btn_select.config(state="normal")
        self.status_var.set("Idle.")
        
        if success:
            messagebox.showinfo("Success", message)
            if out_dir and os.path.exists(out_dir):
                os.startfile(out_dir)
        else:
            messagebox.showerror("Error", message)

if __name__ == '__main__':
    root = tk.Tk()
    app = ImageEnhancerApp(root)
    root.mainloop()