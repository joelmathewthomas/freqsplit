import subprocess
import os
import librosa
import soundfile as sf
import tempfile

def preprocess_audio(input_file: str, target_sr: int = 41000):
    """
    Preprocess the audio file by loading, converting to mono, and resampling.

    Parameters:
        input_file (str): Path to the input audio file to be processed.
        target_sr (int): The target sample rate for the resampled audio.

    Returns:
        str: Path to the temporary processed audio file.
    """
    # Load the audio with librosa, converting to mono and resampling
    waveform, sr = librosa.load(input_file, sr=target_sr, mono=True)
    
    # Create a temporary file to save the processed audio
    temp_audio_path = tempfile.mktemp(suffix=".wav")
    
    # Save the processed audio to the temporary file
    sf.write(temp_audio_path, waveform, target_sr)
    
    return temp_audio_path

def separate_audio_with_demucs(input_file: str, output_dir: str = './separated_output'):
    """
    Use subprocess to run Demucs separation on an input audio file.

    Parameters:
        input_file (str): Path to the input audio file to be separated.
        output_dir (str): Directory where the separated output will be saved.
    """
    # Create the output directory if it does not exist
    os.makedirs(output_dir, exist_ok=True)

    # Preprocess the audio file
    processed_audio = preprocess_audio(input_file)

    # Demucs command to separate the audio file
    command = [
        'demucs',
        '--out', output_dir,  # Output directory for separated tracks
        processed_audio       # Input processed file
    ]
    
    try:
        # Run the command as a subprocess
        subprocess.run(command, check=True)
        print(f"Separation completed. Output saved to {output_dir}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while running Demucs: {e}")
    except FileNotFoundError:
        print("Demucs is not installed or not found in the system PATH.")
    finally:
        # Clean up the temporary file
        os.remove(processed_audio)

if __name__ == "__main__":
    # Example usage
    input_audio_path = 'samples/pancakes_for_dinner.wav'  # Path to your audio file
    output_folder = './separated_output'  # Where the separated files will be stored
    separate_audio_with_demucs(input_audio_path, output_folder)
