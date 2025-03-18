import librosa
import numpy as np

def generate_spectrogram(audio_file: str, spectrogram_type: str = 'mel', sr: int = 22050):
    """
    Generates a spectrogram array from an audio file.

    Args:
        audio_file (str): Path to the input audio file.
        spectrogram_type (str): Type of spectrogram ('stft', 'mel'). Default is 'mel'.
        sr (int): Sampling rate for audio. Default is 22050.

    Returns:
        tuple: A tuple containing:
            - np.ndarray: Spectrogram array (in decibels).
            - dict: Metadata for plotting (sr, x_axis, y_axis).
    """

    # Load the audio file
    waveform, sr = librosa.load(audio_file, sr=sr)

    # Create the spectrogram
    if spectrogram_type == 'mel':
        spec = librosa.feature.melspectrogram(y=waveform, sr=sr)
        spec_db = librosa.power_to_db(spec, ref=np.max) # Convert to decibels
        plot_data = {'sr': sr, 'x_axis': 'time', 'y_axis': 'mel'}
    elif spectrogram_type == 'stft':
        spec = np.abs(librosa.stft(waveform))
        spec_db = librosa.amplitude_to_db(spec, ref=np.max)
        plot_data = {'sr': sr, 'x_axis': 'time', 'y_axis': 'log'}
    else:
        raise ValueError(f"Unsupported spectrogram type: {spectrogram_type}")

    return spec_db, plot_data
