import os
import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .tasks import save_and_classify
from freqsplit.input.format_checker import is_supported_format

UPLOAD_DIR = "/tmp/freqsplit"

# Ensure the temp directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@api_view(['POST'])
def upload_audio(request):
    """Handles audio file upload and saves it to /tmp/freq-split-enhance"""
    if 'file' not in request.FILES:
        return Response({"Error: No file provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    audio_file = request.FILES['file']
    
    # Check file format before proceeding
    if not is_supported_format(audio_file.name):
        return Response({"error": "Unsupported file format"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate a unique ID for this upload
    file_uuid = str(uuid.uuid4())[:8]
    
    #Create a subdirectory for this upload
    upload_dir = os.path.join(UPLOAD_DIR, file_uuid)
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, audio_file.name)
    
    # Save the uploaded file
    task = save_and_classify.apply(args=(file_path, audio_file.read()))
    
    if task.successful():
        audio_class = task.result
        return Response(
            {
                "Status": "File uploaded successfully",
                "file_uuid": file_uuid,
                "audio_class": audio_class
                }, 
            status=status.HTTP_201_CREATED,
            )
