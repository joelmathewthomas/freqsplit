import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import csv

# Force TensorFlow to use only CPU
tf.config.set_visible_devices([], 'GPU')

model = hub.load('https://tfhub.dev/google/yamnet/1')

#Find the name of the class with the top score when mean-aggregated across frames.
def class_names_from_csv(class_map_scv_text):
    """Returns list of class names corresponding to score vector."""
    class_names = []
    with tf.io.gfile.GFile(class_map_scv_text) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            class_names.append(row['display_name'])
    return class_names

# Main function to process audio and classify
def classify_audio(waveform, sr):
    """
    Given an audio file, this function loads the audio, resamples it, 
    normalizes it, and runs it through the YAMNet model to classify the sound.

    Args:
    - waveform (numpy.ndarray): waveform of the audio file (WAV, MP3, etc.).

    Returns:
    - str: Predicted class label of the audio.
    """
    
    # Check if the sampling rate is 16000Hz
    try:
        if(sr!=16000):
            raise RuntimeError
    except Exception:
        raise RuntimeError(f"The audio is not sampled at 16000Hz, failed to classify audio.")
    
    # Normalize the waveform to [-1.0, 1.0] (librosa already returns normalized values)
    waveform = waveform / np.max(np.abs(waveform))

    # Execute the YAMNet model
    try:
        scores, embeddings, spectrogram = model(waveform)
    except Exception as e:
        raise RuntimeError(f"Error: Failed to classify audio: {e}")
        
    # Extract the class names from the model
    class_map_path = model.class_map_path().numpy()
    class_names = class_names_from_csv(class_map_path)

    # Find the class with the highest score
    scores_np = scores.numpy()
    inferred_class = class_names[scores_np.mean(axis=0).argmax()]

    return inferred_class