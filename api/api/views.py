import os
import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import get_audio_file_path
from .tasks import save_and_classify
from .tasks import normalize_audio_task
from .tasks import trim_audio_task
from .tasks import resample_audio_task
from freqsplit.input.format_checker import is_supported_format

UPLOAD_DIR = "/tmp/freqsplit"

# Ensure the temp directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

#

# Endpoint to upload audio and classify it to audio_class
@api_view(['POST'])
def upload_audio(request):
    """Handles audio file upload and saves it to /tmp/freq-split-enhance"""
    if 'file' not in request.FILES:
        return Response({"Error: No file provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    audio_file = request.FILES['file']
    
    # Check file format before proceeding
    if not is_supported_format(audio_file.name):
        return Response({"error": "Unsupported file format"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Generate a unique ID for this upload
    file_uuid = str(uuid.uuid4())[:8]
    
    #Create a subdirectory for this upload
    upload_dir = os.path.join(UPLOAD_DIR, file_uuid)
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, audio_file.name)
    
    # Save the uploaded file
    task = save_and_classify.apply(args=(file_path, audio_file.read()))
    
    if task.successful():
        audio_class = task.result[0]
        return Response(
            {
                "Status": "File uploaded successfully",
                "file_uuid": file_uuid,
                "audio_class": audio_class,
                "sr": task.result[1]
                }, 
            status=status.HTTP_201_CREATED,
            )

# Endpoint to normalize audio
@api_view(['POST'])
def normalize_audio(request):
    """Handles audio normalization request"""
    stat, result, status_code = get_audio_file_path(request, UPLOAD_DIR)
    if stat == False:
        return Response({"error": result}, status=status_code)
    
    # Call Celery task synchronously
    task = normalize_audio_task.apply(args=(result,))
    
    if task.get():
        return Response({"message": "Audio normalized successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Failed to normalize audio"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Endpoint to trim audio
@api_view(['POST'])
def trim_audio(request):
    """Handles trimming of leading and trailing silence from an audio clip"""
    stat, result, status_code = get_audio_file_path(request, UPLOAD_DIR)
    if stat == False:
        return Response({"error": result}, status=status_code)
    
    # Call Celery task synchronously
    task = trim_audio_task.apply(args=(result,)) 

    if task.get():
        return Response({"message": "Audio trimmed successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Failed to trim audio"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Endpoint to resample audio
@api_view(['POST'])
def resample_audio(request):
    """Handles the resampling of audio"""
    stat, result, status_code = get_audio_file_path(request, UPLOAD_DIR)
    if stat == False:
        return Response({"error": result}, status=status_code)
    
    sr = request.data.get("sr")
    if not sr:
        return Response({"error": "Missing sr"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Call Celery task synchronously
    task = resample_audio_task.apply(args=(result, sr))

    if task.get():
        return Response({"message": f"Audio resampled to {sr} successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Failed to resample audio"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
