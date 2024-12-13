/* eslint-disable react/prop-types */
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import axiosInstance from "../config/axiosInstance";
import OtpForm from "./OtpForm";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userId, setUserId] = useState(null);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    try {
      console.log("Google Sign-In successful. Sending token to backend...");
      const response = await axiosInstance.post("/register-google", {
        token: credentialResponse.credential,
      });
      const user = response.data.data;
      console.log(user);
      setSnackbar({
        open: true,
        message: "Google registration successful!",
        isError: false,
      });

      // Save the user and redirect
      // window.localStorage.setItem('token', user.token);
      // navigate('/');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response.data.error,
        isError: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        isError: true,
      });
      return false;
    }

    if (!isValidEmail(formData.email)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        isError: true,
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords don't match.",
        isError: true,
      });
      return false;
    }

    try {
      const response = await axiosInstance.post("/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      const userId = response.data.data._id;
      console.log(userId);
      setUserId(userId);
      setSnackbar({
        open: true,
        message: "Registration successful! Please verify your OTP.",
        isError: false,
      });
      setShowOtpForm(true);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Registration failed!",
        isError: true,
      });
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpForm(false);
    onSwitchToLogin(); // Switch to the login form
  };

  return (
    <Box display="flex">
      <Box flex={1}>
        <img
          src="https://png.pngtree.com/background/20230403/original/pngtree-travel-plane-box-picture-image_2274211.jpg"
          alt="Registration"
          style={{ height: "100%", objectFit: "cover", width: "100%" }}
        />
      </Box>
      <Box
        flex={1}
        p={5}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {showOtpForm ? (
          <OtpForm userId={userId} onOtpSuccess={handleOtpSuccess} />
        ) : (
          <>
            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Register
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              display="flex"
              flexDirection="column"
              gap={3}
            >
              <TextField
                name="username"
                label="Username"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="password"
                label="Password"
                variant="outlined"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Register
              </Button>

              <GoogleOAuthProvider clientId={client_id}>
                <GoogleLogin
                  onSuccess={handleGoogleRegisterSuccess}
                  onError={() =>
                    setSnackbar({
                      open: true,
                      message: "Google registration failed!",
                      isError: true,
                    })
                  }
                />
              </GoogleOAuthProvider>
            </Box>
            <Typography align="center" mt={3}>
              Already have an account?{" "}
              <Button onClick={onSwitchToLogin} color="primary">
                Login
              </Button>
            </Typography>
          </>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
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

export default RegisterForm;
