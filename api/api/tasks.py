from celery import shared_task
from freqsplit.input.file_reader import read_audio
from freqsplit.preprocessing.classify import classify_audio
from freqsplit.preprocessing.normalize import normalize_audio
from freqsplit.postprocessing.audio_writer import export_audio

@shared_task
def save_and_classify(file_path, file_content):
    """Save uploaded file asynchronously and classify the audio file"""
    with open(file_path, 'wb') as destination:
        destination.write(file_content)
        
    # Read the saved audio file
    waveform, sr = read_audio(file_path, 16000, mono=True)
    
    # Classify the audio
    audio_class = classify_audio(waveform, sr)
    
    return audio_class

@shared_task
def normalize_audio_task(file_path):
    """Celery task to normalize audio synchronously"""
    try:
        audio, sr = read_audio(file_path) # Read audio
        normalized_audio = normalize_audio(audio) # Normalize
        export_audio(normalized_audio, file_path, sr) # Save file
        return True
    except Exception as e:
        return False
        