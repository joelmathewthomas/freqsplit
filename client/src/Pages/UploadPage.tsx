import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logs from "../components/Logs"
import Toast from "../components/Toast";
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
  Mic as MicIcon,
  Stop as StopIcon
} from "@mui/icons-material";
import StepperComponent from "../components/StepperComponent";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useMediaContext } from "../contexts/MediaContext";
import { formatLogMessage } from "../utils/logUtils";

function UploadPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { socket, isConnected } = useWebSocket();
  const { setMediaFile, setResponse, setLogs, setToastOpen, setToastMessage } = useMediaContext();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [upload, setUpload] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    setUpload(false);
    setResponse({
      audio_class: "",
      file_uuid: "",
      sr: 0,
      spectrogram: "",
      spec_sr: 0
    });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const file = new File([blob], "recording.wav", { type: "audio/wav" });
        validateAndSetFile(file);
        handleUpload(file);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      showErrorToast("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  }

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
    setUpload(false);
    setResponse({
      audio_class: "",
      file_uuid: "",
      sr: 0,
      spectrogram: "",
      spec_sr: 0
    });
    const selectedFile = e.target.files?.[0] || null;
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    
    if (selectedFile) {
      if (selectedFile.size > maxSize) {
        showErrorToast("Max file size is 100MB!");
        setFile(null);
        setUpload(false);
        e.target.value = "";
        return;
      }
    }

    validateAndSetFile(selectedFile);
    handleUpload(selectedFile);
  };

  const validateAndSetFile = (file: File | null) => {
    if (!file) return;

    const fileType = file.type;
    if (!fileType.includes("audio") && !fileType.includes("video")) {
      showErrorToast("Please upload only audio or video files.");
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
      showErrorToast("Please upload a file to continue");
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
      showErrorToast("Failed to upload file");
      setUpload(false);
      setResponse({
        audio_class: "",
        file_uuid: "",
        sr: 0,
        spectrogram: "",
        spec_sr: 0
      });
      setFile(null);
      console.error("Upload failed:", error);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StepperComponent activeStep={0} />

      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Upload or Record Your Media
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
            overflow: "auto",
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
            accept="audio/*"
            disabled={!inputEnabled}
          />
          <CloudUploadIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {file ? file.name : "Drop your file here or click to browse files"}
          </Typography>
          <Typography>Supported formats: MP3, WAV, AAC, OGG</Typography>
        </Box>

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
            overflow: "auto"
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
        <Button
          variant="contained"
          color={isRecording ? "secondary" : "primary"}
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from reaching file input
            isRecording ? stopRecording() : startRecording();
          }}
          disabled={!isConnected}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        </Box>
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
      <Toast />
    </Container>
  );
}

export default UploadPage;
