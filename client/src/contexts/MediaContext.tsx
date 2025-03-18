import React, { createContext, useState, useContext } from 'react';

interface MediaContextType {
  mediaFile: { name: string; url: string; type: string } | null;
  setMediaFile: (file: { name: string; url: string; type: string }) => void;
  response: { file_uuid: string; sr: number; audio_class: string, spectrogram: string, spec_sr: number }; 
  setResponse: (response: { file_uuid: string; sr: number; audio_class: string, spectrogram: string, spec_sr: number }) => void;
  extractedFiles: { name: string; url: string, spectrogram: string, spec_sr: number }[];
  setExtractedFiles: (files: {name: string; url: string, spectrogram: string, spec_sr: number}[]) => void;
  downloadedFileURL:  string;
  setDownloadedFileURL: ( file: string) => void;
}


const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaFile, setMediaFile] = useState<MediaContextType['mediaFile']>(null);
  const [response, setResponse] = useState<MediaContextType["response"]>({
    audio_class: "",
    file_uuid: "",
    sr: 0,
    spectrogram: "",
    spec_sr: 0
  });
  const [extractedFiles, setExtractedFiles] = useState<MediaContextType["extractedFiles"]>([]);
  const [downloadedFileURL, setDownloadedFileURL] = useState<MediaContextType["downloadedFileURL"]>("");
  

  return (
    <MediaContext.Provider value={{ mediaFile, setMediaFile, response, setResponse, extractedFiles, setExtractedFiles, downloadedFileURL, setDownloadedFileURL }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMediaContext must be used within a MediaProvider");
  }
  return context;
};
