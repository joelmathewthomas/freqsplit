import { Snackbar, Alert } from "@mui/material";
import { useMediaContext } from "../contexts/MediaContext";

const Toast: React.FC = () => {
    const { toastOpen, setToastOpen, toastMessage } = useMediaContext();
    return (
        <Snackbar
                open={toastOpen}
                autoHideDuration={4000}
                onClose={() => {
                    setToastOpen(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={() => setToastOpen(false)}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {toastMessage}
                </Alert>
              </Snackbar>
      );
}

export default Toast