import torch
from asteroid.models import ConvTasNet

def separate(audio, model_name='mpariente/ConvTasNet_WHAM!_sepclean'):
    """
    Separates audio into sources using a pretrained Asteroid model.

    Args:
        audio (numpy.ndarray): The audio time series (1D numpy array).
        model_name (str): Name of the pretrained model from Asteroid. Default is 'mpariente/ConvTasNet_WHAM!_sepclean'.

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
        
        # Remove batch dimension
        separated_sources = separated_sources.squeeze(0)  # Shape: (num_sources, num_samples)
        
        # Split into list of sources
        separated_sources_np = separated_sources.cpu().numpy()  # Convert to NumPy
        separated_sources_list = [separated_sources_np[i, :] for i in range(separated_sources_np.shape[0])]
        
        return separated_sources_list
    except Exception as e:
        raise RuntimeError(f"Error during separation: {e}")
