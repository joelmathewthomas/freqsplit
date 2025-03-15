import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useMediaContext } from "../contexts/MediaContext";

function UploadPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setMediaFile, setResponse, response } = useMediaContext(); // ✅ Correct function name
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [upload, setUpload] = useState(false);
 
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
      }); // ✅ Corrected function call
      navigate("/preview");
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
    formData.append("file", file); // ✅ No more errors because we checked `file` is not null.
  
    try {
      const res = await axios.post<{
        file_uuid: string;
        sr: number;
        audio_class: string;
      }>("http://127.0.0.1:8000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Upload response:", res);
  
      if (res.status === 201 && res.data) {
        setResponse( ({
          audio_class: res.data.audio_class,
          file_uuid: res.data.file_uuid,
          sr: res.data.sr,
        }));
        setUpload(true);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  
  useEffect(() => {
    console.log("Updated response:", response);
  }, [response]);
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StepperComponent activeStep={0} />

      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Upload Your Media
        </Typography>
        <Typography variant="body1" paragraph color="textSecondary">
          Drag and drop your audio or video file, or click to browse
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
          />
          
          <CloudUploadIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {file ? file.name : "Drop your file here or click to browse"}
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
      
    </Container>
  );
}

export default UploadPage;
