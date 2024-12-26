import subprocess
import os
import soundfile as sf
import tempfile
from pathlib import Path

def separate_audio_with_demucs(input_file, sample_rate, output_dir: str):
    """
    Use subprocess to run Demucs separation on an input audio file.
    Parameters:
        input_file (str): Path to the input audio file to be separated.
        output_dir (str): Directory where the separated output will be saved.
    """


    # Create the output directory if it does not exist
    os.makedirs(output_dir, exist_ok=True)

    # Demucs command to separate the temp audio file
    command = [ 'demucs', '--out', output_dir, input_file]

    try:
        # Run the command as a subprocess
        subprocess.run(command, check=True)
        print(f"Separation completed. Output saved to {output_dir}")
    except subprocess.CalledProcessError as e:
        print(f"An error occured while running demucs : {e}")
    except FileNotFoundError:
        print("Demucs is not installed or not found in the system PATH")
    finally:
        # Cleanup the temporary file
        os.remove(input_file)


    