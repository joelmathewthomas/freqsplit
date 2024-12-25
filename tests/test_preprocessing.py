import pytest
import librosa
from src.preprocessing.normalize import normalize_audio
from src.preprocessing.trim import trim_audio
from src.preprocessing.classify import classify_audio
from src.input.file_reader import read_audio

def test_normalize_audio():
    file_path = "samples/cafe_crowd_talk.aiff"
    audio, _ = read_audio(file_path)
    normalized_audio = normalize_audio(audio)

    assert normalized_audio.max() <= 1.0
    assert normalized_audio.min() >= -1.0

def test_trim_audio():
    file_path = "samples/cafe_crowd_talk.aiff"
    audio, sr = read_audio(file_path)
    trimmed_audio = trim_audio(audio, sr)

    assert len(trimmed_audio) <= len(audio)

def test_classify():
    file_path = "samples/cafe_crowd_talk.wav"
    expected_class = "Speech"
    predicted_class = classify_audio(file_path)

    assert predicted_class == expected_class , f"Expected {expected_class}, but got {predicted_class}"