import os
import librosa
import torch
import shutil
import soundfile as sf
import numpy as np
from df.enhance import enhance, init_df, load_audio, save_audio

def split_audio(audio, sr, chunk_size=5):
    """Split audio into chunks of `chunk_size` seconds."""
    samples_per_chunk = sr * chunk_size
    return [audio[i:i + samples_per_chunk] for i in range(0, len(audio), samples_per_chunk)]

def noisereduce(input_audio_path, output_audio_path, model_path=None):
    """
    Apply noise reduction using DeepFilterNet with chunking.
    
    Args:
        input_audio_path (str): Path to the input noisy audio file.
        output_audio_path (str): Path to save the enhanced audio file.
        model_path (str, optional): Path to a custom DeepFilterNet model. Defaults to None (uses pre-trained model).

    Returns:
        str: Path to the enhanced audio file.
    """
    if not os.path.exists(input_audio_path):
        raise FileNotFoundError(f"Input file {input_audio_path} not found")

    output_dir = os.path.dirname(output_audio_path)
    os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
    
    # Initialize DeepFilterNet model
    model, df_state, _ = init_df(model_path)
    
    # Load audio
    audio, sr = librosa.load(input_audio_path, sr=None)
    
    # Ensure output and chunk directories exist
    parent_dir = os.path.dirname(input_audio_path)
    chunk_dir = os.path.join(parent_dir, "chunks")
    output_chunk_dir = os.path.join(chunk_dir, "output")
    os.makedirs(chunk_dir, exist_ok=True)
    os.makedirs(output_chunk_dir, exist_ok=True)
    
    # Split audio into 5-second chunks
    chunks = split_audio(audio, sr, chunk_size=5)
    chunk_paths = []
    
    for i, chunk in enumerate(chunks):
        chunk_path = os.path.join(chunk_dir, f"chunk_{i}.wav")
        sf.write(chunk_path, chunk, sr)
        chunk_paths.append(chunk_path)
    
    enhanced_chunk_paths = []
    
    # Process each chunk sequentially to avoid OOM errors
    for chunk_path in chunk_paths:
        output_chunk_path = os.path.join(output_chunk_dir, os.path.basename(chunk_path))
        
        # Load and enhance
        chunk_audio, _ = load_audio(chunk_path, sr=df_state.sr())
        enhanced_audio = enhance(model, df_state, chunk_audio)
        
        # Save enhanced chunk
        save_audio(output_chunk_path, enhanced_audio, df_state.sr())
        enhanced_chunk_paths.append(output_chunk_path)
    
    # Combine enhanced chunks back into a single audio file
    final_audio = []
    for chunk_path in enhanced_chunk_paths:
        chunk_audio, _ = librosa.load(chunk_path, sr=sr)  # Keep original sample rate
        final_audio.append(chunk_audio)
    
    final_audio = np.concatenate(final_audio, axis=0)
    
    # Save final enhanced audio
    sf.write(output_audio_path, final_audio, sr)
    
    # Clean up temporary chunk files and directories
    shutil.rmtree(chunk_dir, ignore_errors=True)
    
    
    return output_audio_path
