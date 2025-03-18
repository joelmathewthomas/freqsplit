import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { Typography, Container, Paper, Box, LinearProgress } from "@mui/material";
import StepperComponent from "../components/StepperComponent";
import { useMediaContext } from "../contexts/MediaContext";
import axios from "axios";

function ProcessingPage() {
  const navigate = useNavigate();
  const { mediaFile, response } = useMediaContext();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing media...");

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processStep = async (url: string, nextStep: () => void, progressValue: number, status: string, extraData = {}) => {
    try {
      const formData = new FormData();
      formData.append("file_uuid", response.file_uuid);
      Object.entries(extraData).forEach(([key, value]) => 
        formData.append(key, String(value))
      );
      

      setStatusText(status);
      const startTime = Date.now();
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 && res.data) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 5000) await delay(5000 - elapsedTime);
        setProgress(progressValue);
        nextStep();
      }
    } catch (error) {
      console.error(`Error in step: ${url}`, error);
    }
  };

  useEffect(() => {
    if (!mediaFile) {
      navigate("/upload");
      return;
    }

    console.log("Starting processing...");

    processStep("/api/normalize", () => {
      processStep("/api/trim", () => {
        if (response.audio_class === "Music") {
          processStep("/api/resample", () => {
            processStep("/api/separate", () => setProgress(100), 100, "Separating music into vocals, bass, drums and other...");
          }, 75, "Resampling audio to 44100Hz...", { sr: "44100" });
        } else {
          processStep("/api/noisereduce", () => setProgress(100), 100, "Reducing background noise from the audio...");
        }
      }, 50, "Trimming silent parts from the audio...");
    }, 25, "Normalizing audio frequency...");
  }, [mediaFile, navigate]);

  useEffect(() => {
    if (progress === 100) {
    
      navigate('/results')
      
    }
  }, [progress]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StepperComponent activeStep={2} />

      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Processing Your Media
        </Typography>
        <Typography variant="body1" paragraph color="textSecondary">
          Please wait while we process your file
        </Typography>

        <Box sx={{ mt: 4, mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {Math.round(progress)}% Complete
          </Typography>
        </Box>

        <Box sx={{ mt: 6 }}>
          <Typography variant="body1" color="textSecondary">
            {statusText}
          </Typography>
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

export default ProcessingPage;