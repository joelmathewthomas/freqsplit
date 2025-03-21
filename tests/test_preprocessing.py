import pytest
import librosa
import numpy as np
from freqsplit.preprocessing.normalize import normalize_audio
from freqsplit.preprocessing.trim import trim_audio
from freqsplit.preprocessing.classify import classify_audio
from freqsplit.input.file_reader import read_audio
from freqsplit.preprocessing.resample import resample

def test_normalize_audio():
    file_path = "tests/test_audio/cafe_crowd_talk.aiff"
    audio, _ = read_audio(file_path)
    normalized_audio = normalize_audio(audio)

    assert normalized_audio.max() <= 1.0
    assert normalized_audio.min() >= -1.0

def test_trim_audio():
    file_path = "tests/test_audio/cafe_crowd_talk.aiff"
    audio, sr = read_audio(file_path)
    trimmed_audio = trim_audio(audio, sr)

    assert len(trimmed_audio) <= len(audio)

def test_classify():
    file_path = "tests/test_audio/cafe_crowd_talk.wav"
    waveform, sr = read_audio(file_path, 32000, mono=True)
    expected_class = "Speech"
    predicted_class = classify_audio(waveform, sr)

    assert predicted_class == expected_class , f"Expected {expected_class}, but got {predicted_class}"

def test_resample():
    """
    Test the resample function to ensure it correctly resamples the waveform.
    """

    # Generate a synthetic sine wave for testing
    org_samplerate = 22050  # Original sample rate
    new_samplerate = 16000  # Target sample rate
    duration = 1.0  # 1 second duration
    t = np.linspace(0, duration, int(org_samplerate * duration), endpoint=False)
    waveform = 0.5 * np.sin(2 * np.pi * 440 * t)  # 440 Hz sine wave

    # Perform resampling
    resampled_waveform, output_samplerate = resample(waveform, org_samplerate, new_samplerate)

    # Assertions
    assert output_samplerate == new_samplerate, "The output sample rate does not match the target sample rate."
    assert len(resampled_waveform) == int(new_samplerate * duration), \
        "The length of the resampled waveform does not match the expected length."
    assert np.allclose(
        np.max(resampled_waveform), np.max(waveform), atol=0.1
    ), "The amplitude of the resampled waveform deviates significantly from the original."

    print("Test passed: resample function works as expected.")