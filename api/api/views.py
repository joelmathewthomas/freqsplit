import os
import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .tasks import save_and_classify
from .tasks import normalize_audio_task
from freqsplit.input.format_checker import is_supported_format

UPLOAD_DIR = "/tmp/freqsplit"

# Ensure the temp directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Endpoint to upload audio and classify it to audio_class
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

# Endpoint to normalize audio
@api_view(['POST'])
def normalize_audio(request):
    """Handles audio normalization request"""
    file_uuid = request.data.get("file_uuid")
    
    if not file_uuid:
        return Response({"error": "Missing file_uuid"}, status=status.HTTP_400_BAD_REQUEST)
    
    audio_dir = os.path.join(UPLOAD_DIR, file_uuid)
    
    if not os.path.exists(audio_dir) or not os.path.isdir(audio_dir):
        return Response({"error": "File directory not found"}, status=status.HTTP_400_BAD_REQUEST)
    
     # Get the actual file name (since there's only one file)
    files = os.listdir(audio_dir)
    if not files:
        return Response({"error": "No file found in directory"}, status=status.HTTP_400_BAD_REQUEST)

    file_name = files[0]
    file_path = os.path.join(audio_dir, file_name)
    
    # Call Celery task synchronously
    task = normalize_audio_task.apply(args=(file_path,))
    
    if task.get():
        return Response({"message": "Audio normalized successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Failed to normalize audio"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)