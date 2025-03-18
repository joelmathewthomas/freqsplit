import React, { createContext, useState, useContext } from 'react';

interface MediaContextType {
  mediaFile: { name: string; url: string; type: string } | null;
  setMediaFile: (file: { name: string; url: string; type: string }) => void;
  response: { file_uuid: string; sr: number; audio_class: string }; 
  setResponse: (response: { file_uuid: string; sr: number; audio_class: string }) => void;
  extractedFiles: { name: string; url: string }[];
  setExtractedFiles: (files: {name: string; url: string }[]) => void;
}


const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaFile, setMediaFile] = useState<MediaContextType['mediaFile']>(null);
  const [response, setResponse] = useState<MediaContextType["response"]>({
    audio_class: "",
    file_uuid: "",
    sr: 0,
  });

  const [extractedFiles, setExtractedFiles] = useState<MediaContextType["extractedFiles"]>([]);
  

  return (
    <MediaContext.Provider value={{ mediaFile, setMediaFile, response, setResponse, extractedFiles, setExtractedFiles }}>
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
