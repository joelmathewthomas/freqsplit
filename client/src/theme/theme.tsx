import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    logText: {
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      whiteSpace: 'nowrap',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
         
          textTransform: 'none',
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
         
        },
      },
    },
  },
});

export default theme;