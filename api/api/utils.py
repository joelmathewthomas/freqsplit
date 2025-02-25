# api/utils.py
import os

def get_audio_file_path(file_uuid, base_dir):
    """Returns the full path to the audio file inside the given UUID folder."""
    dir_path = os.path.join(base_dir, file_uuid)
    if not os.path.exists(dir_path) or not os.listdir(dir_path):
        return False
    return os.path.join(dir_path, os.listdir(dir_path)[0])  # Assumes only one file exists