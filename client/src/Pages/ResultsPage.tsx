import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
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
} from '@mui/material';
import { 
  Check as CheckIcon,
  VolumeUp as VolumeUpIcon 
} from '@mui/icons-material';
import StepperComponent from '../components/StepperComponent';
import { useMediaContext } from '../contexts/MediaContext';

function ResultsPage() {
  const navigate = useNavigate();
  const { mediaFile, response, extractedFiles, downloadedFileURL } = useMediaContext();
  console.log("Extracted files are", extractedFiles);
//  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = [useRef(null), useRef(null), useRef(null),useRef(null)];
  const mediaFileRef = useRef(null);
  const audioClass = response.audio_class
  const isVideo = mediaFile?.type.includes('video');

  const handleDownloadAll = () => {
    if (audioClass === 'Music') {
      extractedFiles.forEach(({ name, url }) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } else {
      const link = document.createElement('a');
      link.href = downloadedFileURL;
      link.download = mediaFile?.name ?? 'downloaded_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  useEffect(() => {
    if (!mediaFile) {
      navigate('/upload');
    }
  }, [mediaFile, navigate]);
  
//  const togglePlay = (index) => {
//    if (audioRefs[index].current) {
//      if (isPlaying) {
//        audioRefs[index].current.pause();
//      } else {
//        audioRefs[index].current.play();
//      }
//      setIsPlaying(!isPlaying);
//    }
//  };

  if (!mediaFile) return <LinearProgress />;
  
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
            <video
              src={mediaFile.url}
              style={{ width: '100%', borderRadius: 8 }}
              controls
            />
          ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 2 }}>
              <VolumeUpIcon color="primary" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {mediaFile.name} (Original)
              </Typography>
              <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {mediaFile.name}
                </Typography>
                <audio
                  ref={mediaFileRef}
                  src={mediaFile.url}
                  style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                  controls
                />
              </Box>
              {audioClass === "Music" ? (
                <>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                    Processed Files
                  </Typography>
                </Box>
                {extractedFiles.map((file, index) => (
                  <Box key={index} sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {file.name}
                    </Typography>
                    <audio
                      ref={audioRefs[index]}
                      src={file.url}
                      style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                      controls
                    />
                  </Box>
                ))}
              </>
              ) : (
                <>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                      Processed File
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {mediaFile?.name}
                      </Typography>
                    <audio
                      ref={audioRefs[0]}
                      src={downloadedFileURL}
                      style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                      controls
                    />
                  </Box>
                </>
              )}
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
                  <strong>Name:</strong> {mediaFile.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Type:</strong> {mediaFile.type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button variant="outlined" color="primary" onClick={() => navigate('/upload')}>
            Process Another File
          </Button>
          <Button variant="contained" color="primary" onClick={handleDownloadAll}>Download All Files</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ResultsPage;