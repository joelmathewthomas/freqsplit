import os
import pytest
from src.input.file_reader import read_audio
from src.separation.convtasnet_wrapper import separate
from src.postprocessing.audio_writer import export_audio


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
