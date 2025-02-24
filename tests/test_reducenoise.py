import os
import pytest
import soundfile as sf
from freqsplit.refinement.deepfilternet_wrapper import noisereduce

def test_noisereduce():
    """Test noise reduction function to ensure output is valid."""
    input_audio_path = "tests/test_audio/noise.wav"
    output_audio_path = "/tmp/noisereduce/output.wav"

    # Ensure test input exists
    assert os.path.exists(input_audio_path), f"Test input file {input_audio_path} not found."

    # Run noise reduction
    noisereduce(input_audio_path, output_audio_path)

    # Check if the output file exists
    assert os.path.exists(output_audio_path), "Output file was not created."

    # Load the enhanced audio and check if it's valid
    enhanced_audio, sample_rate = sf.read(output_audio_path)
    assert len(enhanced_audio) > 0, "Enhanced audio is empty."
    assert sample_rate > 0, "Invalid sample rate in output file."
