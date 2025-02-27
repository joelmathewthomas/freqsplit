import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Container, 
  Button, 
  Paper, 
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  useTheme 
} from '@mui/material';
import { 
  Check as CheckIcon,
  VolumeUp as VolumeUpIcon 
} from '@mui/icons-material';
import StepperComponent from '../components/StepperComponent';
import { useMediaContext } from '../contexts/MediaContext';

function ResultsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mediaFile, clearMedia } = useMediaContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (!mediaFile) {
      navigate('/upload');
    }
  }, [mediaFile, navigate]);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProcessAnother = () => {
    clearMedia();
    navigate('/upload');
  };
  
  if (!mediaFile) return <LinearProgress />;
  
  const isVideo = mediaFile.type.includes('video');
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StepperComponent activeStep={3} />
      
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <CheckIcon sx={{ color: 'success.main', fontSize: 36, mr: 1 }} />
          <Typography variant="h4" color="primary">
            Processing Complete!
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph color="textSecondary" align="center">
          Your processed media is ready to view and download
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
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </Box>
          ) : (
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
                {mediaFile.name} (Processed)
              </Typography>
              <Box sx={{ width: '100%', mt: 2 }}>
                <audio
                  ref={videoRef}
                  src={mediaFile.url}
                  style={{ width: '100%' }}
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </Box>
            </Box>
          )}
        </Box>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  File Details
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Name:</strong> {mediaFile.name} (Processed)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Type:</strong> {mediaFile.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Size:</strong> {(mediaFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Typography variant="body2" paragraph color="textSecondary">
                  Download or share your processed media
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mb: 1 }}
                    onClick={() => alert('Downloading file...')}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => alert('Sharing file...')}
                  >
                    Share
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleProcessAnother}
          >
            Process Another File
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ResultsPage;