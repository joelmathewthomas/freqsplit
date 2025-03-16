import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { Typography, Container, Paper, Box, LinearProgress } from "@mui/material";
import StepperComponent from "../components/StepperComponent";
import { useMediaContext } from "../contexts/MediaContext";
import axios from "axios";

function ProcessingPage() {
  const navigate = useNavigate();
  const { mediaFile, response } = useMediaContext();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const showToast = (msg, type) => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const processStep = async (url, nextStep, progressValue, extraData = null) => {
    try {
      const formData = new FormData();
      formData.append("file_uuid", response.file_uuid);
      
      if (extraData) {
        for (const key in extraData) {
          formData.append(key, extraData[key]);
        }
      }

      const startTime = Date.now();
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 && res.data) {
        showToast(res.data.message, "success");
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 5000) await delay(5000 - elapsedTime);
        setProgress(progressValue);
        nextStep();
      } else {
        showToast(`Step failed: ${url}`, "error");
      }
    } catch (error) {
      console.error(`Error in step: ${url}`, error);
      showToast(`Error processing: ${url}`, "error");
    }
  };

  useEffect(() => {
    if (!mediaFile) {
      navigate("/upload");
      return;
    }

    console.log("Starting processing...");

    processStep("http://127.0.0.1:8000/api/normalize", () => {
      processStep("http://127.0.0.1:8000/api/trim", () => {
        if (response.audio_class === "Music") {
          processStep(
            "http://127.0.0.1:8000/api/resample",
            () => {
              processStep("http://127.0.0.1:8000/api/separate", () => setProgress(100), 100);
            },
            75,
            { sr: response.sr?.toString() || "44100" }
          );
        } else {
          processStep("http://127.0.0.1:8000/api/noisereduce", () => setProgress(100), 100);
        }
      }, 50);
    }, 25);
  }, [mediaFile, navigate]);

  useEffect(() => {
    if (progress === 100) {
      navigate("/results");
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