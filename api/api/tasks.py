import os
import shutil
import json
import numpy as np
from pathlib import Path
from celery import shared_task
from freqsplit.input.file_reader import read_audio
from freqsplit.preprocessing.classify import classify_audio
from freqsplit.preprocessing.normalize import normalize_audio
from freqsplit.preprocessing.trim import trim_audio 
from freqsplit.preprocessing.resample import resample
from freqsplit.postprocessing.audio_writer import export_audio
from freqsplit.separation.demucs_wrapper import separate_audio_with_demucs
from freqsplit.refinement.deepfilternet_wrapper import noisereduce
from freqsplit.spectrogram.generator import generate_spectrogram


@shared_task
def save_and_classify(file_path, file_content):
    """Save uploaded file asynchronously and classify the audio file"""
    with open(file_path, 'wb') as destination:
        destination.write(file_content)
        
    # Read the saved audio file
    _, org_sr = read_audio(file_path) # Get original sampling rate
    waveform, sr = read_audio(file_path, 32000, mono=True)
    
    # Classify the audio
    audio_class = classify_audio(waveform, sr)

    # Generate spectrogram
    spec_db, plot_data = generate_spectrogram(file_path)
    # Convert numpy array to JSON-safe list
    spec_db = np.nan_to_num(spec_db, nan=-80.0, posinf=-80.0, neginf=-80.0)
    spec_data_json = json.dumps(spec_db.tolist())

    return audio_class, org_sr, spec_data_json, plot_data['sr']

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

@shared_task
def trim_audio_task(file_path):
    """Celery task to trim audio synchronously"""
    try:
       audio, sr = read_audio(file_path)
       trimmed_audio = trim_audio(audio, sr)
       export_audio(trimmed_audio, file_path, sr)
       return True
    except Exception as e:
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
        return False

@shared_task
def music_separation_task(file_path):
    """Celery task to separate music audio into sources"""
    file_path = Path(file_path)
    print("File path is ", file_path)
    
    # Determine the base directory (output path)
    output_path = file_path.parent
    
    # Run Demucs separation
    separate_audio_with_demucs(str(file_path), str(output_path))
    
    # Define expected output dir
    demucs_dir = output_path / 'htdemucs'
    file_folder = demucs_dir / file_path.stem 
    
    if not file_folder.exists():
        raise RuntimeError(f"Demucs output folder not found: {file_folder}")

    # Expected output files
    expected_files = ["bass.wav", "drums.wav", "other.wav", "vocals.wav"]

    # Create "sources" directory to store separated components
    sources_dir = output_path / "sources"
    sources_dir.mkdir(exist_ok=True)
    
    # Move separate files to output_path and replace original file with vocals.wav, and move other files into sources/
    try:
        vocals_path = file_folder / "vocals.wav"
        if not vocals_path.exists():
            raise RuntimeError("Vocals file not found in Demucs output")
        
        # Replace original file with vocals.wav while keeping original name
        shutil.move(str(vocals_path), str(file_path))
        
        # Move other separated files to the "sources" directory
        for expected_file in expected_files:
            src_file = file_folder / expected_file
            if src_file.exists() and expected_file != "vocals.wav":
                shutil.move(str(src_file), str(sources_dir / expected_file))
            
        # Cleanup: Remove htedemucs directory
        shutil.rmtree(str(demucs_dir))
        
        return True
    
    except Exception as e:
        return False 
   
@shared_task
def noisereduce_task(file_path):
    """Celery task to remove noise from audio"""
    file_path = Path(file_path)
    
    # Run noisereduction
    try:
        noisereduce(file_path, file_path)
        return True
    except Exception as e:
        return False

@shared_task
def cleanup_task(file_path):
    """Celery task to cleanup files"""
    file_path = Path(file_path)
    
    # Cleanup
    try:
        shutil.rmtree(os.path.dirname(file_path))
        return True
    except Exception as e:
        return False