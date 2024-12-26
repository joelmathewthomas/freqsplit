import subprocess
import os

def separate_audio_with_demucs(input_file: str, output_dir: str = './separated_output'):
    """
    Use subprocess to run Demucs separation on an input audio file.

    Parameters:
        input_file (str): Path to the input audio file to be separated.
        output_dir (str): Directory where the separated output will be saved.
    """
    # Create the output directory if it does not exist
    os.makedirs(output_dir, exist_ok=True)

    # Demucs command to separate the audio file
    # --out: specifies output directory
    command = [
        'demucs',
        '--out', output_dir,  # Output directory for separated tracks
        input_file            # Input file
    ]
    
    try:
        # Run the command as a subprocess
        subprocess.run(command, check=True)
        print(f"Separation completed. Output saved to {output_dir}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while running Demucs: {e}")
    except FileNotFoundError:
        print("Demucs is not installed or not found in the system PATH.")

if __name__ == "__main__":
    # Example usage
    input_audio_path = 'samples/pancakes_for_dinner.wav'  # Path to your audio file
    output_folder = './separated_output'  # Where the separated files will be stored
    separate_audio_with_demucs(input_audio_path, output_folder)
