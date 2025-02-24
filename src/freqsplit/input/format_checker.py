import mimetypes

def is_supported_format(file_path):
    """
    Checks if the audio file is in a supported format.

    Args:
        file_path (str): Path to the audio file.

    Returns:
        bool: True if supported, False otherwise.
    """
    supported_formats = ["audio/mpeg", "audio/wav", "audio/x-aiff", "audio/x-wav", ...]
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type in supported_formats
