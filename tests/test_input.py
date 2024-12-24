import pytest
from  src.input.file_reader import read_audio
from src.input.format_checker import is_supported_format

def test_read_audio():
    file_path = "samples/cafe_crowd_talk.aiff"
    audio, sr = read_audio(file_path)
    assert len(audio) > 0
    assert sr > 0

def test_is_supported_format():
    assert is_supported_format("samples/cafe_crowd_talk.aiff") == True
    assert is_supported_format("samples/unsupported_file.txt") == False