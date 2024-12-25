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

class_map_path = model.class_map_path().numpy()
class_names = class_names_from_csv(class_map_path)

wav_file_name = 'cafe_crowd_talk.wav'
waveform, sample_rate = librosa.load(wav_file_name, sr=16000)

# Show some basic information about the audio.
duration = len(waveform)/sample_rate
print(f'Sample rate: {sample_rate} Hz')
print(f'Total duration: {duration:.2f}s')
print(f'Size of the input: {len(waveform)}')

# The waveform needs to be normalized to values in [-1.0, 1.0] (librosa load already does this)
# No need to do this as librosa already normalizes# The wav_data needs to be normalized to values in [-1.0, 1.0]

# Execute the Model
# Check the output.
scores, embeddings, spectogram = model(waveform)
scores_np = scores.numpy()
spectogram_np = spectogram.numpy()
infered_class = class_names[scores_np.mean(axis=0).argmax()]
print(f'The main sound is : {infered_class}')



