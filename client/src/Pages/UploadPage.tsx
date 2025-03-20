import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logs from "../components/Logs"
import axios from "axios";
import {
  Typography,
  Container,
  Button,
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  VolumeUp as VolumeUpIcon,
  Movie as MovieIcon,
} from "@mui/icons-material";
import StepperComponent from "../components/StepperComponent";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useMediaContext } from "../contexts/MediaContext";
import { formatLogMessage } from "../utils/logUtils";

function UploadPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { socket, isConnected } = useWebSocket();
  const { setMediaFile, setResponse, setLogs } = useMediaContext();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [upload, setUpload] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);

  useEffect(() => {
    const startLogs = async () => {
      setLogs([formatLogMessage("Initializing freqsplit")]);
  
      setLogs((prevLogs) => [
        ...prevLogs,
        formatLogMessage("Connecting to server"),
      ]);
  
      axios
        .get("/api/ping")
        .then((ping_resp) => {
          if (ping_resp.status === 200) {
            setLogs((prevLogs) => [
              ...prevLogs,
              formatLogMessage("Connection established successfully"),
            ]);
            setLogs((prevLogs) => [
              ...prevLogs,
              formatLogMessage("Waiting for WebSocket connection"),
            ]);
  
            const checkWebSocketConnection = () => {
              if (isConnected) {
                setLogs((prevLogs) => [
                  ...prevLogs,
                  formatLogMessage("WebSocket connected"),
                ]);
                setInputEnabled(true);
              } else {
                setTimeout(checkWebSocketConnection, 100);
              }
            };
  
            checkWebSocketConnection();
          } else {
            setLogs((prevLogs) => [
              ...prevLogs,
              formatLogMessage("Failed to connect to server"),
            ]);
          }
        })
        .catch(() => {
          setLogs((prevLogs) => [
            ...prevLogs,
            formatLogMessage("Failed to connect to server"),
          ]);
        });
    };
  
    startLogs();
  }, [isConnected]);
 
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
    handleUpload(selectedFile);
  };

  const validateAndSetFile = (file: File | null) => {
    setFileError("");

    if (!file) return;

    const fileType = file.type;
    if (!fileType.includes("audio") && !fileType.includes("video")) {
      setFileError("Please upload only audio or video files.");
      return;
    }

    setFile(file);
  };

  const handleContinue = () => {
    if (file) {
      
      setMediaFile({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      }); //
      navigate('/preview');
    } else {
      setFileError("Please upload a file to continue.");
    }
  };

  const handleUpload = async (file: File | null) => {
    if (!file) {
      console.error("No file selected!");
      return; // Exit early if file is null
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setLogs((prevLogs) => [...prevLogs, formatLogMessage("freqsplit/input: Uploading audio file")]);
      const res = await axios.post<{
        file_uuid: string;
        sr: number;
        audio_class: string;
        spectrogram: string;
        spec_sr: number;
      }>("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (res.status === 201 && res.data) {
        setResponse( ({
          audio_class: res.data.audio_class,
          file_uuid: res.data.file_uuid,
          sr: res.data.sr,
          spectrogram: res.data.spectrogram,
          spec_sr: res.data.spec_sr
        }));
        if (socket && isConnected){
          socket.send(JSON.stringify({ file_uuid: res.data.file_uuid }))
        } else {
          console.error("Websocket not connected!");
        }
        
        setUpload(true);
        setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/input: Uploaded file successfully`)])
        setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/input: file_uuid: ${res.data.file_uuid}`)])
        setLogs((prevLogs) => [...prevLogs, formatLogMessage(`freqsplit/input: audio_class: ${res.data.audio_class}`)])
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StepperComponent activeStep={0} />

      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Upload Your Media
        </Typography>

        <Box
          sx={{
            border: `2px dashed ${
              isDragging ? theme.palette.primary.main : theme.palette.divider
            }`,
            borderRadius: 2,
            p: 6,
            mt: 3,
            mb: 3,
            backgroundColor: isDragging
              ? "rgba(63, 81, 181, 0.08)"
              : "transparent",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="audio/*,video/*"
            disabled={!inputEnabled}
          />
          
          <CloudUploadIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {file ? file.name : "Drop your file here or click to browse files"}
          </Typography>
          {file && (
            <Typography variant="body2" color="textSecondary">
              {file.type.includes("video") ? (
                <MovieIcon sx={{ mr: 1 }} />
              ) : (
                <VolumeUpIcon sx={{ mr: 1 }} />
              )}
              {file.type} - {(file.size / (1024 * 1024)).toFixed(2)} MB
            </Typography>
          )}
        </Box>

        {fileError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {fileError}
          </Typography>
        )}

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            disabled={!upload}
          >
            Continue to Preview
          </Button>
        </Box>
      </Paper>
      <Logs />
    </Container>
  );
}

export default UploadPage;
