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
  useTheme 
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  PlayArrow as PlayArrowIcon,
  Check as CheckIcon 
} from '@mui/icons-material';

function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  
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
            Upload, preview, and process your audio and video files with ease
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
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CloudUploadIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Easy Upload
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Drag and drop your media files for quick processing
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PlayArrowIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Preview Media
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Review your files before processing
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  View Results
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Download and share your processed media
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;