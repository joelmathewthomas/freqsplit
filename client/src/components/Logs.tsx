import { Box, Typography } from "@mui/material";
import { useMediaContext } from "../contexts/MediaContext";

const Logs = () => {
  const { logs } = useMediaContext();

  return (
    <Box
      sx={{
        bgcolor: '#000',
        color: '#fff',
        padding: '8px',
        borderRadius: '4px',
        width: '100%',
        minHeight: '100px',
        maxHeight: '200px',
        overflowY: 'auto',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
        mt: '40px',
      }}
    >
      {logs.length > 0 ? (
        logs.map((log, index) => (
          <Typography key={index} variant="logText" display="block">
            {`> ${log}`}
          </Typography>
        ))
      ) : (
        <Typography variant="logText" sx={{ opacity: 0.5 }}>
          Waiting for logs...
        </Typography>
      )}
    </Box>
  );
  
};

export default Logs;