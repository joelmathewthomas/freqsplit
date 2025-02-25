import soundfile as sf
import numpy as np

def export_audio(audio, output_path, sr):
    """
    Save a NumPy audio array to a specified audio file.

    Args:
        audio (numpy.ndarray): The audio data to be saved.`
        output_path (str): The path where the audio file should be saved.
        sr (int): The sampling rate of the audio.
    """

    try:
        
        print(f"Initial audio shape: {audio.shape}, dtype: {audio.dtype}, max: {np.max(audio)}, min: {np.min(audio)}")

        if audio.ndim == 2 and audio.shape[0] == 2:
            # Transpose stereo audio to match the expected shape
            audio = audio.T  # From (2, num_samples) to (num_samples, 2)

        # Ensure the audio data type is float32
        audio = audio.astype('float32')
        
        # Normalize audio to avoid distortion
        if np.max(np.abs(audio)) > 0:  # Avoid divide by zero
            audio = audio / np.max(np.abs(audio))

        # Verify final format
        print(f"Final audio shape: {audio.shape}, dtype: {audio.dtype}, max: {np.max(audio)}, min: {np.min(audio)}")

        
        sf.write(output_path, audio, sr, format='wav')
        print(f"Audio saved to {output_path}")
    except Exception as e:
        print(f"Error saving audio: {e}")