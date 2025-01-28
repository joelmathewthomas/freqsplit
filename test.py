import os
from src.input.file_reader import read_audio
from src.separation.convtasnet_wrapper import separate
from src.postprocessing.audio_writer import export_audio

def main(input_audio_path, output_dir, model_name="mpariente/ConvTasNet_WHAM!_sepclean"):
    try:
        audio, sr = read_audio(input_audio_path)
        print(f"Loaded audio from {input_audio_path} with sampling rate {sr}")
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        
        separated_sources = separate(audio, model_name)
        print(f"Separated {len(separated_sources)} sources")
        
        for i, source in enumerate(separated_sources):
            output_path = os.path.join(output_dir, f"source_{i+1}.wav")
            export_audio(source, output_path, sr)
            print(f"Exported separated source {i + 1} to {output_path}")
        
    except Exception as e:
        print(f"Error in processing: {e}")
        

if __name__ == "__main__":
    input_audio_path = "/home/joel/Downloads/wham/female-female-mixture.wav"  
    output_dir = "/tmp/convtasnet"  
    main(input_audio_path, output_dir)

        