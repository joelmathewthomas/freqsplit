import matplotlib.pyplot as plt
import librosa.display
import numpy as np

def display_spectrogram(spec_array: np.ndarray, plot_data: dict):
    """
    Displays a spectrogram array using Matplotlib.

    Args:
        spec_array (np.ndarray): Spectrogram array (in decibels).
        plot_data (dict): Metadata for plotting (e.g., sr, x_axis, y_axis).
    """
    plt.figure(figsize=(10, 4))
    librosa.display.specshow(spec_array, sr=plot_data['sr'], x_axis=plot_data['x_axis'], y_axis=plot_data['y_axis'])
    plt.colorbar(format='%+2.0f dB')
    plt.title(f"Spectrogram ({plot_data['y_axis'].upper()} axis)")
    plt.tight_layout()
    plt.show()
