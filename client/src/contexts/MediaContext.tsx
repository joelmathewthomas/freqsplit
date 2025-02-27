import React, { createContext, useState, useContext } from 'react';

interface MediaContextType {
  mediaFile: { name: string; url: string; type: string } | null;
  setMediaFile: (file: { name: string; url: string; type: string }) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaFile, setMediaFile] = useState<MediaContextType['mediaFile']>(null);

  return (
    <MediaContext.Provider value={{ mediaFile, setMediaFile }}>
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
