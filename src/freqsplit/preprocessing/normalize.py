import librosa
import numpy as np

def normalize_audio(audio: np.ndarray) -> np.ndarray:
    """
    Normalize the audio to a range of [-1, 1].

    Args:
    - audio (np.ndarray): The audio time series to normalize.

    Returns:
    - np.ndarray: The normalized audio time series.
    """
    return librosa.util.normalize(audio)
