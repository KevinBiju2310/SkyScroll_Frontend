/* eslint-disable react/prop-types */
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// console.log(client_id);

const LoginForm = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axiosInstance.post("/signin-google", {
        token: credentialResponse.credential,
      });
      const user = response.data.data;
      console.log(user);
      setSnackbar({
        open: true,
        message: "Google login successful!",
        isError: false,
      });
      dispatch(setUser(user));
      // Save the user and redirect
      // For simplicity: window.localStorage.setItem('token', user.token);
      // navigate("/");
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Google login failed!",
        isError: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
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

    console.log(formData);
    try {
      const response = await axiosInstance.post("/signin", {
        email: formData.email,
        password: formData.password,
      });

      const user = response.data.data;
      console.log(user);

      dispatch(setUser(user));

      if (onClose) {
        onClose();
      }

      navigate("/");
      setSnackbar({
        open: true,
        message: "Registration successful!",
        isError: false,
      });
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Registration failed!",
        isError: true,
      });
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setSnackbar({
        open: true,
        message: "Please enter your email address.",
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
    try {
      const email = formData.email;
      await axiosInstance.post("/forgot-password", { email });
      setSnackbar({
        open: true,
        message: "Password reset link sent! Check your email.",
        isError: false,
      });
      setIsForgotPassword(false); 
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Error sending password reset link.",
        isError: true,
      });
    }
  };

  return (
    <GoogleOAuthProvider clientId={client_id}>
      <Box display="flex">
        <Box flex={1}>
          <img
            src="https://png.pngtree.com/background/20230403/original/pngtree-travel-plane-box-picture-image_2274211.jpg"
            alt="Login"
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
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            {isForgotPassword ? "Forgot Password" : "Login"}
          </Typography>
          <Box
            component="form"
            onSubmit={
              isForgotPassword ? handleForgotPasswordSubmit : handleSubmit
            }
            display="flex"
            flexDirection="column"
            gap={3}
          >
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

            {/* Show password field only if it's login form */}
            {!isForgotPassword && (
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
            )}
            {!isForgotPassword && (
              <Typography
                variant="body2"
                align="right"
                sx={{ cursor: "pointer" }}
                color="primary"
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              fullWidth
            >
              {isForgotPassword ? "Reset Password" : "Login"}
            </Button>

            {/* Conditionally render Forgot Password button */}
            {!isForgotPassword && (
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() =>
                  setSnackbar({
                    open: true,
                    message: "Google login failed!",
                    isError: true,
                  })
                }
              />
            )}
          </Box>

          {!isForgotPassword && (
            <Typography align="center" mt={3}>
              Don{"'"}t have an account?{" "}
              <Button onClick={onSwitchToRegister} color="primary">
                Register
              </Button>
            </Typography>
          )}

          {/* Button to switch back to login form from forgot password form */}
          {isForgotPassword && (
            <Typography
              align="center"
              variant="body2"
              sx={{ cursor: "pointer", mt: 2 }}
              color="primary"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </Typography>
          )}
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={800}
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
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
