import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import {
  Typography,
  Container,
  Paper,
  Box,
  LinearProgress,
} from "@mui/material";
import StepperComponent from "../components/StepperComponent";
import { useMediaContext } from "../contexts/MediaContext";
import axios from "axios";

function ProcessingPage() {
  const navigate = useNavigate();
  const { mediaFile, response } = useMediaContext();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const showToast = (
    msg: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };
  const processNormalize = async () => {
    try {
      const formData = new FormData();
      formData.append("file_uuid", response.file_uuid);
      const res = await axios.post("http://127.0.0.1:8000/api/normalize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response from server:", res);
      if (res.status === 200 && res.data) {
        showToast(res.data.message, "success");
        setProgress(25)
        processTrim();
      } else {
        showToast("Audio Normalization failed", "error");
      }
    } catch (error) {
      console.error("Normalization failed:", error);
    }
  };
  const processTrim = async () => {
    try {
      const formData = new FormData();
      formData.append("file_uuid", response.file_uuid);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/trim",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response from server:", res);
      if (res.status === 200 && res.data) {
        showToast(res.data.message, "success");
        if (response.audio_class === "Music") {
          setProgress(50)
          processResampling();
        }else{
          setProgress(75)
          processNoiseReduce()
        }
      } else {
        showToast("Audio Trimming failed", "error");
      }
    } catch (error) {
      console.error("Trimming failed:", error);
      return;
    }
  };
  const processResampling = async () => {
    try {
      const formData = new FormData();
      formData.append("file_uuid", response.file_uuid);
      formData.append("sr", String(response.sr));
      const res = await axios.post(
        "http://127.0.0.1:8000/api/resample",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response from server:", res);
      if (res.status === 200 && res.data) {
        showToast(res.data.message, "success");
        setProgress(75)
        processSeparate()
        
      } else {
        showToast("Audio Resampling failed", "error");
      }
    } catch (error) {
      console.error("Resampling failed:", error);
    }
  };

  const processNoiseReduce = async () => {
    try {
      const formData = new FormData();
      formData.append("file_uuid", response.file_uuid);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/noisereduce",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response from server:", res);
      if (res.status === 200 && res.data) {
        showToast(res.data.message, "success");
        setTimeout(()=>{
          setProgress(100)
        },5000)
      } else {
        showToast("Audio NoiseRemoval failed", "error");
      }
    } catch (error) {
      console.error("NoiseRemoval failed:", error);
    }
  };
  const processSeparate = async () => {
    try {
      const formData = new FormData();
      formData.append("file_uuid", response.file_uuid);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/separate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response from server:", res);
      if (res.status === 200 && res.data) {
        setProgress(100)
        showToast("Audio separated successfully", "success");
      } else {
        showToast("Audio separation failed", "error");
      }
    } catch (error) {
      console.error("Separation failed:", error);
    }
  };
  
  

  useEffect(() => {
    if (!mediaFile) {
      navigate("/upload");
      return;
    }
    console.log("Normalizing....");
    processNormalize();
    
  }, [mediaFile, navigate]);

  useEffect(()=>{
    if(progress == 100){
      navigate('/results')
    } 
  },[progress])

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
            {progress < 30
              ? "Analyzing media..."
              : progress < 60
              ? "Applying processing..."
              : progress < 90
              ? "Finalizing..."
              : "Almost done..."}
          </Typography>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={1000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default ProcessingPage;
