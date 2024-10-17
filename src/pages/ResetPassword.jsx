import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../config/axiosInstance";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/reset-password", {
        token,
        newPassword: formData.newPassword,
      });

      // Show success message from backend in Snackbar
      setSnackbarMessage(response.data.response.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setErrorMessage("");
      setFormData({
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      // Show error message from backend in Snackbar
      setSnackbarMessage(
        error.response?.data?.error || "Failed to reset password"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      p={3}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        width="100%"
        maxWidth="400px"
        gap={2}
        p={3}
        boxShadow={3}
      >
        <Typography variant="h4" align="center" mb={2}>
          Reset Password
        </Typography>

        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}

        <TextField
          name="newPassword"
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          name="confirmNewPassword"
          label="Confirm New Password"
          type="password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Reset Password
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor: snackbarSeverity === "success" ? "green" : "red",
            color: "white",
          }}
          icon={
            snackbarSeverity === "success" ? (
              <span style={{ color: "white" }}>✓</span>
            ) : (
              <span style={{ color: "white" }}>✗</span>
            )
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;
