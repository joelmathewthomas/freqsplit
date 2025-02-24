import librosa
import numpy as np

def trim_audio(audio:np.ndarray, sr:int) -> np.ndarray:
    """
    Trim leading and trailing silence from the audio.

    Args:
    - audio (np.ndarray): The audio time series.
    - sr (int): The sample rate of the audio.

    Returns:
    - np.ndarray: The trimmed audio time series.
    """

    audio_trimmed, _ = librosa.effects.trim(audio)
    return audio_trimmed