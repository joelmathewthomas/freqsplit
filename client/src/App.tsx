import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import theme from './theme/theme';
import { MediaProvider } from './contexts/MediaContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
// Import pages
import LandingPage from './Pages/LandingPage';
import UploadPage from './Pages/UploadPage';
import PreviewPage from './Pages/PreviewPage';
import ProcessingPage from './Pages/ProcessingPage';
import ResultsPage from './Pages/ResultsPage';
import AudioVisualizer from './components/AudioVisualizer';

// Custom Link component for AppBar
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MediaProvider>
        <WebSocketProvider>
          <Router>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>FreqSplit</Typography>
                <Button color="inherit" href="/"> <HomeIcon sx={{ mr: 1 }} /> Home </Button>
              </Toolbar>
            </AppBar>

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/processing" element={<ProcessingPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path='/audio' element={<AudioVisualizer />}/>
            </Routes>
          </Router>
        </WebSocketProvider>
      </MediaProvider>
    </ThemeProvider>
  );
};

export default App;
