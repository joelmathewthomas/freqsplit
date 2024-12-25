import tensorflow as tf
import tensorflow_hub as hub
import librosa
import numpy as np
import csv

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
def classify_audio(file_path):
    """
    Given an audio file, this function loads the audio, resamples it, 
    normalizes it, and runs it through the YAMNet model to classify the sound.

    Args:
    - file_path (str): Path to the audio file (WAV, MP3, etc.).

    Returns:
    - str: Predicted class label of the audio.
    """
    # Load audio using librosa (this handles both loading, resampling, and conversion to mono)
    waveform, sample_rate = librosa.load(file_path, sr=16000, mono=True)  # Ensuring 16k sample rate and mono

    # Normalize the waveform to [-1.0, 1.0] (librosa already returns normalized values)
    waveform = waveform / np.max(np.abs(waveform))

    # Execute the YAMNet model
    scores, embeddings, spectrogram = model(waveform)
    
    # Extract the class names from the model
    class_map_path = model.class_map_path().numpy()
    class_names = class_names_from_csv(class_map_path)

    # Find the class with the highest score
    scores_np = scores.numpy()
    inferred_class = class_names[scores_np.mean(axis=0).argmax()]

    return inferred_class