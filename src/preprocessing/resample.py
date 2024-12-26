import librosa

def resample(waveform, org_samplerate, new_samplerate):
    """
    Reads a waveform and returns a waveform resampled to samplerate.

    Args:
        waveform: waveform of the target audio.
        org_samplerate : original samplerate of the audio.
        new_samplerate : samplerate to which the audio is to be resampled.
    """

    try:
        waveform = librosa.resample(waveform, orig_sr=org_samplerate, target_sr=new_samplerate)
        return waveform, new_samplerate
    except Exception as e: 
        raise RuntimeError(f"Error reasmpling the audio file: {e}")
    
