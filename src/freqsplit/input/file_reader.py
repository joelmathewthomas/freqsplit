import os
import librosa

def read_audio(file_path, sr=None, mono=None):
    """
    Reads an audio file and returns the audio time series and sampling rate.

    Args:
        file_path (str): Path to the audio file.
        sr (int): Sample rate at which the audio is to be loaded
        mono (bool): True to loaded audio with single channels, else False.

    Returns:
        tuple: audio_time_series (numpy.ndarray), sampling_rate (int)
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    try:
        librosa_kwargs = {"sr": sr}
        if mono is not None:  # Only add 'mono' if explicitly provided
            librosa_kwargs["mono"] = mono

        audio, sr = librosa.load(file_path, **librosa_kwargs)
        return audio, sr
    except Exception as e:
        raise RuntimeError(f"Error reading the audio file: {e}")