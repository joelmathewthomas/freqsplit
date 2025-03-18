import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Container, 
  Button, 
  Paper, 
  Box, 
  LinearProgress,
} from '@mui/material';
import { VolumeUp as VolumeUpIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import StepperComponent from '../components/StepperComponent';
import { useMediaContext } from '../contexts/MediaContext';
// @ts-ignore
import SpectrogramPlayer from "react-audio-spectrogram-player"

function PreviewPage() {
  const navigate = useNavigate();
  const { mediaFile, response } = useMediaContext();
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const audioClass = response.audio_class
  // Supported video formats
  const supportedFormats = ['video/mp4', 'video/webm', 'video/ogg'];
  const isVideo = mediaFile && supportedFormats.includes(mediaFile.type);

  useEffect(() => {
    if (!mediaFile) {
      navigate('/upload');
    }
  }, [mediaFile, navigate]);
  
  if (!mediaFile) return <LinearProgress />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StepperComponent activeStep={1} />
      
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          Preview Your Media
        </Typography>
        <Typography variant="body1" paragraph color="textSecondary" align="center">
          Review your file before processing
        </Typography>
        
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          {isVideo ? (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'black',
              }}
            >
              <video
                ref={videoRef}
                src={mediaFile.url}
                style={{ width: '100%', borderRadius: 8 }}
                controls
                onError={() => setError(true)}
              />
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  <ErrorIcon sx={{ mr: 1 }} />
                  Video format not supported. Please upload MP4, WebM, or Ogg.
                </Typography>
              )}
            </Box>
          ) : mediaFile.type.startsWith('audio/') ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 2,
              }}
            >
              <VolumeUpIcon color="primary" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {mediaFile.name}
              </Typography>
              <Box sx={{ width: '100%', mt: 2 }}>
                <SpectrogramPlayer
                  src={mediaFile.url}
                  sxx={JSON.parse(response.spectrogram)}
                  SampleRate={response.spec_sr}
                  colormap={'magma'}
                  settings={true}
                  transparent={false}
                  navigator={true}
                />
              </Box>
              <p>Audio Classification: {audioClass || "No data received"}</p>
            </Box>
          ) : (
            <Typography color="error" sx={{ mt: 2 }}>
              <ErrorIcon sx={{ mr: 1 }} />
              Unsupported media format. Please upload a valid audio or video file.
            </Typography>
          )}
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/upload')}
          >
            Back to Upload
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>  navigate('/processing')}
          >
            Process Media
          </Button>
        </Box>
      </Paper>
      <LinearProgress
        variant="query"
        sx={{
          height: 2,
        }}
      />
    </Container>
  );
}

export default PreviewPage;
