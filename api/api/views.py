import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

UPLOAD_DIR = "/tmp/freq-split-enhance"

# Ensure the temp directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@api_view(['POST'])
def upload_audio(request):
    """Handles audio file upload and saves it to /tmp/freq-split-enhance"""
    if 'file' not in request.FILES:
        return Response({"Error: No file provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    audio_file = request.FILES['file']
    file_path = os.path.join(UPLOAD_DIR, audio_file.name)
    
    # Save the uploaded file
    with open(file_path, 'wb') as destination:
        for chunk in audio_file.chunks():
            destination.write(chunk)
            
    return Response({"Status": "File uploaded successfully", "file_path": file_path}, status=status.HTTP_201_CREATED)
