# freq-split-enhance

An evolving **audio processing pipeline** designed to separate and enhance audio components using open-source tools. The project aims to provide a modular framework for working with raw audio files, enabling separation, refinement, and post-processing.

---

🚀 Current Features

- **Audio Input Handling**: Uses librosa for reading and handling audio files.
- **Preprocessing**: Includes resampling, normalization, and trimming using librosa.
- **Audio Classification**: Utilizes Google's YAMNet model to classify audio content.
- **Source Separation**: Implements Demucs for music source separation.
- **Noise Reduction**: Enhances audio by removing background noise using DeepFilterNet.
- **Post-Processing**: Uses librosa to save processed audio files.
- **Modular Architecture**: Designed for easy extension and customization.

---
📁 Project Structure

```bash
freq-split-enhance/
├── api/                # API implementation (future work)
├── client/             # Client-side interactions (future work)
├── src/                # Core processing modules
│   ├── input/          # Audio input handling
│   ├── preprocessing/  # Normalization, resampling, trimming
│   ├── separation/     # Source separation with Demucs
│   ├── postprocessing/ # Post-processing and saving results
│   ├── refinement/     # Noise reduction and enhancement
│   ├── spectogram/     # Spectrogram generation and analysis
├── tests/              # Unit tests
├── requirements.txt    # Dependencies
├── README.md           # Project documentation
├── LICENSE             # License information
└── pytest.ini          # Pytest configuration
```

### 📝 Wiki

For detailed instructions on installing dependencies, setting up Python environments, and configuring the project, visit the [Wiki](https://github.com/joelmathewthomas/freq-split-enhance/wiki).

## 🛡️ License

This project is licensed under the Apache License 2.0.
