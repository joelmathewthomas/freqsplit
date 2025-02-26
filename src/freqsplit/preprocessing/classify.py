import numpy as np
from panns_inference import AudioTagging, labels

# Initialize PANNs model
at = AudioTagging(checkpoint_path=None, device='cuda')

def classify_audio(waveform, sr):
    """
    Given an audio file, this function loads the audio, resamples it, 
    normalizes it, and runs it through the PANNs model to classify the sound.

    Args:
    - waveform (numpy.ndarray): waveform of the audio file (WAV, MP3, etc.).
    - sr (int): Sampling rate of the audio.

    Returns:
    - str: Predicted class label of the audio.
    """
    
    # Check if the sampling rate is 32000Hz
    try:
        if sr != 32000:
            raise RuntimeError
    except Exception:
        raise RuntimeError(f"The audio is not sampled at 32000Hz, failed to classify audio.")
    
    # Normalize the waveform to [-1.0, 1.0]
    waveform = waveform / np.max(np.abs(waveform))
    
    # Ensure waveform shape is correct for model input
    waveform = waveform[None, :]
    
    # Execute the PANNs model
    try:
        clipwise_output, _ = at.inference(waveform)
    except Exception as e:
        raise RuntimeError(f"Error: Failed to classify audio: {e}")
    
    # Get the top predicted class
    predicted_index = np.argmax(clipwise_output)
    inferred_class = labels[predicted_index]
    
    return inferred_class
