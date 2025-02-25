import os
import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .tasks import save_uploaded_file

UPLOAD_DIR = "/tmp/freqsplit"

# Ensure the temp directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@api_view(['POST'])
def upload_audio(request):
    """Handles audio file upload and saves it to /tmp/freq-split-enhance"""
    if 'file' not in request.FILES:
        return Response({"Error: No file provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    audio_file = request.FILES['file']
    
    # Generate a unique ID for this upload
    file_uuid = str(uuid.uuid4())[:8]
    
    #Create a subdirectory for this upload
    upload_dir = os.path.join(UPLOAD_DIR, file_uuid)
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, audio_file.name)
    
    # Save the uploaded file
    save_uploaded_file.delay(file_path, audio_file.read())

    return Response(
        {
            "Status": "File uploaded successfully",
            "file_uuid": file_uuid,
            }, 
        status=status.HTTP_201_CREATED,
        )
