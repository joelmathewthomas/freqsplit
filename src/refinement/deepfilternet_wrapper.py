import os
import torch
from df.enhance import enhance, init_df, load_audio, save_audio

def noisereduce(input_audio_path, output_audio_path, model_path=None):
    """
    Apply noise reduction using DeepFilterNet.
    
    Args:
        input_audio_path (str): Path to the input noisy audio file.
        output_audio_path (str): Path to save the enhanced audio file.
        model_path (str, optional): Path to a custom DeepFilterNet model. Defaults to None (uses the pre-trained model).

    Returns:
        str: Path to the enhanced audio file.
    """
    if not os.path.exists(input_audio_path):
        raise FileNotFoundError(f"Input file {input_audio_path} not found")
    
    # Initialize DeepFilterNet model
    model, df_state, _ = init_df(model_path)
    
    # Load audio
    audio, _ =  load_audio(input_audio_path, sr=df_state.sr())
    
    # Ensure output path exists
    os.makedirs(os.path.dirname(output_audio_path), exist_ok=True)
    
    # Apply noise reduction
    enhanced_audio = enhance(model, df_state, audio)
    
    # Save the enhanced audio
    save_audio(output_audio_path, enhanced_audio, df_state.sr())
    
    return output_audio_path
