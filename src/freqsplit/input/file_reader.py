import os
import librosa

def read_audio(file_path):
    """
    Reads an audio file and returns the audio time series and sampling rate.

    Args:
        file_path (str): Path to the audio file.

    Returns:
        tuple: audio_time_series (numpy.ndarray), sampling_rate (int)
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    try:
        audio, sr = librosa.load(file_path, sr=None) # Load with original sampling rate.
        return audio, sr
    except Exception as e:
        raise RuntimeError(f"Error reading the audio file: {e}")