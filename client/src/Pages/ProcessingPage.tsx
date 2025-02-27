import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Container, 
  Paper, 
  Box, 
  LinearProgress
} from '@mui/material';
import StepperComponent from '../components/StepperComponent';
import { useMediaContext } from '../contexts/MediaContext';

function ProcessingPage() {
  const navigate = useNavigate();
  const { mediaFile } = useMediaContext();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!mediaFile) {
      navigate('/upload');
      return;
    }
    
    // Simulate processing progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/results'), 500);
          return 100;
        }
        return newProgress;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [mediaFile, navigate]);
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StepperComponent activeStep={2} />
      
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Processing Your Media
        </Typography>
        <Typography variant="body1" paragraph color="textSecondary">
          Please wait while we process your file
        </Typography>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="body1" color="textSecondary">
            {progress < 30 ? "Analyzing media..." : 
             progress < 60 ? "Applying processing..." : 
             progress < 90 ? "Finalizing..." : 
             "Almost done..."}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProcessingPage;