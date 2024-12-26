import os
import pytest
import tempfile
import soundfile as sf
from pathlib import Path
from src.input.file_reader import read_audio
from src.preprocessing.trim import trim_audio
from src.preprocessing.resample import resample
from src.separation.demucs_wrapper import separate_audio_with_demucs


def test_demucs_separation_with_preprocessing():
    """
    Test to ensure Demucs separation works with preprocessing and creates expected outputs.
    """

    input_file = "./samples/am_contra_heart_peripheral.wav"
    file_name = Path(input_file).stem
    output_path = "/tmp/demucs-test"
    waveform, samplerate = read_audio(input_file)
    waveform = trim_audio(waveform, samplerate)

    # Resample to 41000Hz
    if samplerate != 41000:
        print("Resampling audio to 41Khz")
        waveform, samplerate = resample(waveform, samplerate, 41000)

    # Create a temporary file to save the processed audio
    temp_audio_path = tempfile.mktemp(suffix=".wav")

    # Save the processed audio to the temporary file
    sf.write(temp_audio_path, waveform, samplerate)

    # Rename the file to orignal name
    dir_path = os.path.dirname(temp_audio_path)
    new_audio_path = os.path.join(dir_path, f"{file_name}.wav")
    os.rename(temp_audio_path, new_audio_path)

    separate_audio_with_demucs(new_audio_path, samplerate, output_path)

    # Verify the htdemucs folder exists
    demucs_dir = Path(output_path) / 'htdemucs'
    assert demucs_dir.exists(), "htdemucs directory not found in output path."

    # Verify the folder named after the file name (without extension) exists
    file_folder = demucs_dir / file_name
    assert file_folder.exists(), f"Folder {file_name} not found inside htdemucs directory."

    # Verify the expected files exist inside the folder
    expected_files = ['bass.wav', 'drums.wav', 'other.wav', 'vocals.wav']
    for expected_file in expected_files:
        file_path = file_folder / expected_file
        assert file_path.exists(), f"Expected file {expected_file} not found in {file_name} folder."
