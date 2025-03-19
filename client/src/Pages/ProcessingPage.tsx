import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { Typography, Container, Paper, Box, LinearProgress } from "@mui/material";
import StepperComponent from "../components/StepperComponent";
import { useMediaContext } from "../contexts/MediaContext";
import axios from "axios";
import JSZip from "jszip";
import Logs from "../components/Logs"
import { formatLogMessage } from "../utils/logUtils";

function ProcessingPage() {
  const navigate = useNavigate();
  const { mediaFile, response, setExtractedFiles, setDownloadedFileURL, setDownloadedFileSpectrogram, setLogs } = useMediaContext();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing media...");

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processStep = async (url: string, log: string | null, nextStep: () => void, progressValue: number, status: string, extraData = {}) => {
    try {

      if (log !== null) {
        setLogs((prevLogs) => [...prevLogs, log]);
      }

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

  const fetchZipDownload = async () => {
    try {
      setStatusText("Fetching Results...");
  
      const res = await axios.get(`/api/download?file_uuid=${response.file_uuid}`, {
        responseType: "blob",
      });
  
      if (res.status === 200) {
        console.log("Download successful");
        await handleDownload(res.data);
      } else {
        console.log("Failed to download the file");
      }
    } catch (error) {
      console.error("Error fetching download:", error);
    }
  };

  const fetchDownload = async () => {
    try {
      setStatusText("Fetching Results...");
  
      const res = await axios.get(`/api/download?file_uuid=${response.file_uuid}`, {
        responseType: "blob",
      });
  
      setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/postprocessing: Exporting source file`)]);
      setTimeout(() => {
        setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/postprocessing: Downloading file`)]);
      }, 100);
      if (res.status === 200) {
        console.log("Download successful");
        const blob = new Blob([res.data], { type: "audio/wav" });
        const fileURL = URL.createObjectURL(blob);

        setDownloadedFileURL( fileURL  );
        setProgress(90);

        // Get spectrogram
        setProgress(95);
        setStatusText("Calculating Spectrogram");
        setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/spectrogram: Calculating spectrogram`)]);

        const formData = new FormData();
        formData.append("file_uuid", response.file_uuid);
        if (mediaFile?.name) {
          formData.append("file_name", mediaFile?.name);
        }

        const startTime = Date.now();
        const resp = await axios.post<{
          Status: String;
          spectrogram: string;
          spec_sr: number;
        }>("/api/spectrogram", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        })

        if (resp.status === 200 && resp.data) {
          const elapsedTime = Date.now() - startTime;
          if(elapsedTime < 5000) await delay(5000 - elapsedTime);
          setDownloadedFileSpectrogram({spectrogram: resp.data.spectrogram, spec_sr: resp.data.spec_sr})
          setProgress(100);
        }


      } else {
        console.log("Failed to download the file");
      }
    } catch (error) {
      console.error("Error fetching download:", error);
    }
  };
  

  const handleDownload = async (downloadData: Blob) => {
    setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/postprocessing: Exporting source files`)]);
    setTimeout(() => {
      setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/postprocessing: Downloading files`)]);
    }, 100);
    const zipBlob = new Blob([downloadData], { type: "application/zip" });
    const zip = await JSZip.loadAsync(zipBlob);

    const fileURLs = [];

    for (const [filename, fileData] of Object.entries(zip.files)) {
      if (!fileData.dir) {
        const fileBlob = await fileData.async("blob");
        const fileURL = URL.createObjectURL(fileBlob);
        
        // Get spectrograms
        setProgress(95);
        setStatusText("Calculating Spectrograms");
        setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/spectrogram: Calculating spectrograms`)]);

        const formData = new FormData();
        formData.append("file_uuid", response.file_uuid);
        formData.append("file_name", filename);

        const res = await axios.post<{
          Status: string;
          spectrogram: string;
          spec_sr: number;
        }>("/api/spectrogram", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        if (res.status === 200 && res.data){

        }
        fileURLs.push({ name: filename, url: fileURL, spectrogram: res.data.spectrogram, spec_sr: res.data.spec_sr });
      }
    }
    console.log(fileURLs)
    setExtractedFiles(fileURLs);
    setProgress(100);
  };

  useEffect(() => {
    if (!mediaFile) {
      navigate("/upload");
      return;
    }

    console.log("Starting processing...");

    processStep("/api/normalize", formatLogMessage("freqsplit/preprocessing: Applying amplitude scaling"), () => {
      processStep("/api/trim", formatLogMessage("freqsplit/preprocessing: Pruning silent segments from audio"), () => {
        if (response.audio_class === "Music") {
          processStep("/api/resample", formatLogMessage(`freqsplit/preprocessing: Performing rate conversion: ${response.sr}Hz -> 44100Hz`), () => {
            processStep("/api/separate", formatLogMessage(`freqsplit/separation: Demucs: Applying Time-domain source extraction`), () => fetchZipDownload(), 90, formatLogMessage("Separating music into vocals, bass, drums and other..."));
          }, 75, "Resampling audio to 44100Hz...", { sr: "44100" });
        } else {
          processStep("/api/noisereduce", formatLogMessage(`freqsplit/refinement: DeepFilterNet: Applying Spectral noise gating`), () => fetchDownload(), 90, formatLogMessage("Reducing background noise from the audio..."));
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
    <Logs />
    </Container>
  );
}

export default ProcessingPage;