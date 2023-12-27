import os

def delete_all_files_in_folder(folder_path = 'audio_output_files'):
    try:
        files = os.listdir(folder_path)
        for file in files:
            file_path = os.path.join(folder_path, file)
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"Deleted: {file_path}")

        print("All files in the folder have been deleted.")
    except Exception as e:
        print(f"Error deleting files: {e}")