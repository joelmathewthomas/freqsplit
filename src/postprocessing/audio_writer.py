import soundfile as sf

def export_audio(audio, output_path, sr):
    """
    Save a NumPy audio array to a specified audio file.

    Args:
        audio (numpy.ndarray): The audio data to be saved.`
        output_path (str): The path where the audio file should be saved.
        sr (int): The sampling rate of the audio.
    """

    try:
        sf.write(output_path, audio, sr)
        print(f"Audio saved to {output_path}")
    except Exception as e:
        print(f"Error saving audio: {e}")