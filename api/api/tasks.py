from celery import shared_task
from freqsplit.input.file_reader import read_audio
from freqsplit.preprocessing.classify import classify_audio
from freqsplit.preprocessing.normalize import normalize_audio
from freqsplit.preprocessing.trim import trim_audio 
from freqsplit.preprocessing.resample import resample
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
        raise RuntimeError(f"RuntimeError: {e}")
        return False

@shared_task
def trim_audio_task(file_path):
    """Celery task to trim audio synchronously"""
    try:
       audio, sr = read_audio(file_path)
       trimmed_audio = trim_audio(audio, sr)
       export_audio(trimmed_audio, file_path, sr)
       return True
    except Exception as e:
        raise RuntimeError(f"RuntimeError: {e}")
        return False
    
@shared_task
def resample_audio_task(file_path, sr):
    """Celery task to resample the audio asynchronously"""
    try:
         audio, org_sr = read_audio(file_path)
         resampled_audio, sr = resample(audio, org_sr, eval(sr))
         export_audio(resampled_audio, file_path, sr)
         return True
    except Exception as e:
        raise RuntimeError(f"RuntimeError: {e}")
        return False