import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
interface IToastProps {
  open: boolean;
  handleClose: () => void;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export const Toast: React.FC<IToastProps> = ({
  open,
  handleClose,
  type = "success",
  message,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
