import os
import pytest
import tempfile
import soundfile as sf
from pathlib import Path
from src.input.file_reader import read_audio
from src.preprocessing.trim import trim_audio
from src.preprocessing.resample import resample
from src.separation.demucs_wrapper import separate_audio_with_demucs
from src.separation.convtasnet_wrapper import separate
from src.postprocessing.audio_writer import export_audio


def test_demucs_separation_with_preprocessing():
    """
    Test to ensure Demucs separation works with preprocessing and creates expected outputs.
    """

    input_file = "tests/test_audio/am_contra_heart_peripheral.wav"
    file_name = Path(input_file).stem
    output_path = "/tmp/demucs-test"
    waveform, samplerate = read_audio(input_file)
    waveform = trim_audio(waveform, samplerate)

    # Resample to 44100Hz
    if samplerate != 44100:
        print("Resampling audio to 44.1Khz")
        waveform, samplerate = resample(waveform, samplerate, 41000)

    # Create a temporary file to save the processed audio
    temp_audio_path = tempfile.mktemp(suffix=".wav")

    # Save the processed audio to the temporary file
    sf.write(temp_audio_path, waveform, samplerate)

    # Rename the file to orignal name
    dir_path = os.path.dirname(temp_audio_path)
    new_audio_path = os.path.join(dir_path, f"{file_name}.wav")
    os.rename(temp_audio_path, new_audio_path)

    separate_audio_with_demucs(new_audio_path, output_path)

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

def test_convtasnet_separation_with_output_files():
    """
    Test to ensure ConvTasNet separation creates expected source audio files.
    """
    
    input_audio_path = "tests/test_audio/female-female-mixture.wav"
    output_dir = "/tmp/convtasnet"
    model_name = "mpariente/ConvTasNet_WHAM!_sepclean"
    
    audio, sr = read_audio(input_audio_path)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    
    separated_sources = separate(audio, model_name)
    
    for i, source in enumerate(separated_sources):
        output_path = os.path.join(output_dir, f"source_{i+1}.wav")
        export_audio(source, output_path, sr)

    # Check if the output directory exists
    assert os.path.exists(output_dir), "Output directory does not exist."

    # Check if source_1.wav and source_2.wav are created
    source_1_path = os.path.join(output_dir, "source_1.wav")
    source_2_path = os.path.join(output_dir, "source_2.wav")

    assert os.path.exists(source_1_path), "source_1.wav was not created."
    assert os.path.exists(source_2_path), "source_2.wav was not created."

    # Check if the files have content (not just created)
    # For example, you can check if the length of the audio files is greater than a certain threshold
    # Here, we'll just verify the files are not empty.
    import soundfile as sf

    def is_file_non_empty(file_path):
        try:
            data, _ = sf.read(file_path)
            return data.size > 0
        except Exception as e:
            return False

    assert is_file_non_empty(source_1_path), "source_1.wav is empty."
    assert is_file_non_empty(source_2_path), "source_2.wav is empty."
    
    print("Test passed: source_1.wav and source_2.wav are present and non-empty.")
