import { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Snackbar } from "@mui/material";
import axiosInstance from "../config/axiosInstance";

const OtpForm = ({ userId, onOtpSuccess }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim() === "") {
      setSnackbar({
        open: true,
        message: "Please enter the OTP.",
        isError: true,
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/verify-otp", { otp, userId });
      setSnackbar({
        open: true,
        message: "OTP verified successfully!",
        isError: false,
      });
      onOtpSuccess();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Invalid OTP or OTP expired.",
        isError: true,
      });
    }
  };

  const handleResendOtp = async () => {
    setTimer(60);
    try {
      const response = await axiosInstance.post("/resend-otp", { userId });
      setSnackbar({
        open: true,
        message: response.data.message || "New OTP sent successfully!",
        isError: false,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to resend OTP.",
        isError: true,
      });
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
        Enter OTP
      </Typography>
      <form onSubmit={handleOtpSubmit} style={{ width: "100%" }}>
        <TextField
          name="otp"
          label="OTP"
          variant="outlined"
          value={otp}
          onChange={handleOtpChange}
          fullWidth
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          disabled={timer <= 0}
        >
          Verify OTP
        </Button>
      </form>

      {timer > 0 ? (
        <Typography variant="body2" align="center" mt={2}>
          Resend OTP in {timer} seconds
        </Typography>
      ) : (
        <Button
          variant="text"
          color="primary"
          onClick={handleResendOtp}
          sx={{ mt: 2 }}
        >
          Resend OTP
        </Button>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        ContentProps={{
          sx: {
            backgroundColor: snackbar.isError ? "error.main" : "success.main",
          },
        }}
      />
    </Box>
  );
};

export default OtpForm;
