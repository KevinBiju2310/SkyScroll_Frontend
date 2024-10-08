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
import axiosInstance from "../utils/axiosInstance";

const LoginForm = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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
  return (
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
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
        <Typography align="center" mt={3}>
          Don{"'"}t have an account?{" "}
          <Button onClick={onSwitchToRegister} color="primary">
            Register
          </Button>
        </Typography>
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
  );
};

export default LoginForm;
