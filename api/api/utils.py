# api/utils.py
import os
from rest_framework import status

def get_audio_file_path(request, base_dir):
    """Returns the full path to the audio file inside the given UUID folder."""
    
    file_uuid = request.data.get("file_uuid")
    if not file_uuid:
        return False, "Missing file_uuid", status.HTTP_400_BAD_REQUEST
    
    dir_path = os.path.join(base_dir, file_uuid)
    
    if not os.path.exists(dir_path) or not os.listdir(dir_path):
        return False, "No file found", status.HTTP_500_INTERNAL_SERVER_ERROR
    return True, os.path.join(dir_path, os.listdir(dir_path)[0]), status.HTTP_200_OK  # Assumes only one file exists