import torch
from asteroid.models import ConvTasNet

def separate(audio, sr, model_name='mpariente/ConvTasNet_WHAMR_enhsingle'):
    """
    Separates audio into sources using a pretrained Asteroid model.

    Args:
        audio (numpy.ndarray): The audio time series (1D numpy array).
        sr (int): Sampling rate of the audio.
        model_name (str): Name of the pretrained model from Asteroid. Default is 'mpariente/ConvTasNet_WHAMR_enhsingle'.

    Returns:
        list: List of separated sources as numpy arrays.
    """
    try:
        # Select the device: GPU if available, otherwise CPU
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {device}")
        
        # Load the pretrained model and move it to the selected device
        model = ConvTasNet.from_pretrained(model_name).to(device)
        
        # Convert the audio array to a PyTorch tensor, add batch dimension, and move to device
        audio_tensor = torch.tensor(audio).unsqueeze(0).to(device)  # Shape: (1, num_samples)
        
        # Perform source separation
        with torch.no_grad():
            separated_sources = model(audio_tensor)
        
        # Convert separated sources to NumPy arrays and remove batch dimension
        separated_sources_np = [src.squeeze(0).cpu().numpy() for src in separated_sources]
        
        return separated_sources_np
    except Exception as e:
        raise RuntimeError(f"Error during separation: {e}")
