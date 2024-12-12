import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Container,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff, Login } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const admin = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        isError: true,
      });
      return false;
    }

    if (!isValidEmail(email)) {
      setSnackbar({
        open: true,
        message: "Enter a valid email address",
        isError: true,
      });
      return false;
    }
    try {
      // console.log(email,password)
      const response = await axiosInstance.post("/admin/signin", {
        email,
        password,
      });
      const admin = response.data.data;
      setSnackbar({
        open: true,
        message: "Successfull Signin",
        isError: false,
      });

      dispatch(setUser(admin));

      setPassword("");
      setEmail("");

      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Error Occured: ", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Login failed. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        isError: true,
      });
    }
  };

  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard");
    }
  }, [admin, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
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
      {/* <AdminHeader />, */}
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h4" align="center" gutterBottom>
                Admin Sign In
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                paragraph
              >
                Enter your credentials to access the admin panel
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<Login />}
              >
                Sign In
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminSignIn;
