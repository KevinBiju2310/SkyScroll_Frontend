import { useEffect, useState } from "react";
import background from "../../assets/background.jpg";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import axiosInstance from "../../config/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/userSlice";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const airline = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Please fill in all Fields",
        isError: true,
      });
      return;
    }
    try {
      const response = await axiosInstance.post("/airline/login", {
        email,
        password,
      });
      console.log(response);
      dispatch(setUser(response.data.response));
      setSnackbar({
        open: true,
        message: "Login Successful",
        isError: false,
      });
      navigate("/airline/dashboard", { replace: true });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        "Error Occurred, please try again later";
      setSnackbar({
        open: true,
        message: errorMessage,
        isError: true,
      });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setSnackbar({
        open: true,
        message: "Please enter your email",
        isError: true,
      });
      return;
    }
    try {
      const response = await axiosInstance.post("/forgot-password", {
        email: forgotEmail,
      });
      setSnackbar({
        open: true,
        message: response.data.message || "Reset link sent to your email",
        isError: false,
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error || "Error sending reset link";
      setSnackbar({
        open: true,
        message: errorMessage,
        isError: true,
      });
    }
  };

  useEffect(() => {
    if (airline) {
      navigate("/airline/dashboard");
    }
  }, [airline, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-1/3 h-100">
        <h2 className="text-2xl font-bold mb-4">Airline Company Login</h2>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          ContentProps={{
            sx: {
              backgroundColor: snackbar.isError ? "error.main" : "success.main",
            },
          }}
        />

        {!showForgotPassword ? (
          // Login Form
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="text-blue-500"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label htmlFor="forgotEmail" className="block mb-2">
                Enter your email
              </label>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Send Reset Link
            </button>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="text-blue-500"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        <p className="mt-4 text-center">
          Don{"'"}t have an account yet?{" "}
          <button
            onClick={() => navigate("/airline/register")}
            className="text-blue-500"
          >
            Apply now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
