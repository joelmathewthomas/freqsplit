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
  useTheme,
  Slide,
  Zoom,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon,
  GraphicEq as GraphicEqIcon,
  NoiseAware as NoiseAwareIcon,
  MusicNote as MusicNoteIcon,
} from '@mui/icons-material';
import { useState } from 'react';

function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showContent, setShowContent] = useState(true);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom right, #3f51b5, #9c27b0)',
        padding: theme.spacing(3),
      }}
    >
      <Container maxWidth="md">
        <Slide direction="down" in={showContent} mountOnEnter unmountOnExit>
          <Paper
            elevation={3}
            sx={{
              padding: theme.spacing(6),
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h3" gutterBottom color="primary">
              Welcome to FreqSplit
            </Typography>
            <Typography variant="h5" paragraph color="textSecondary">
              Upload, preview, and process your audio files with ease
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CloudUploadIcon />}
                onClick={() => navigate('/upload')}
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
            </Box>
          </Paper>
        </Slide>

        <Grid container spacing={4} sx={{ mt: 4, justifyContent: 'center' }}>
          <Grid item xs={12} md={4}>
            <Zoom in={showContent} style={{ transitionDelay: '100ms' }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Upload or Record
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Drag and drop your media files or record directly for quick processing.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={4}>
            <Zoom in={showContent} style={{ transitionDelay: '200ms' }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <PlayArrowIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Preview Media
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Review your files before processing.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={4}>
            <Zoom in={showContent} style={{ transitionDelay: '300ms' }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    View Results
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Download and share your processed media.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid item xs={12} md={4}>
            <Zoom in={showContent} style={{ transitionDelay: '400ms' }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <GraphicEqIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Audio Source Separation (Demucs)
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Separate audio sources with state-of-the-art Demucs.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={4}>
            <Zoom in={showContent} style={{ transitionDelay: '500ms' }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <NoiseAwareIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Noise Reduction (DeepFilterNet)
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Reduce noise effectively using DeepFilterNet.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={4}>
            <Zoom in={showContent} style={{ transitionDelay: '600ms' }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <MusicNoteIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Audio Processing (Librosa)
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Advanced audio processing and manipulation with Librosa.
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;