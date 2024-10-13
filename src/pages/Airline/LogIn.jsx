import { useState } from "react";
import background from "../../assets/background.jpg";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure all fields are filled
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Please fill in all Fields",
        isError: true,
      });
      return;
    }

    try {
      // Sending login request to the backend
      const response = await axiosInstance.post("/airline/login", {
        email,
        password,
      });

      // Assuming login is successful and you handle the next steps like redirecting
      console.log(response);
      setSnackbar({
        open: true,
        message: "Login Successful",
        isError: false,  // Not an error, hence false
      });

      // Navigate to another page on success, e.g., dashboard
      // navigate('/dashboard');
      
    } catch (error) {
      // Handling error response from the backend
      const errorMessage = error?.response?.data?.error || "Error Occurred, please try again later";

      // Show the error message in the snackbar
      setSnackbar({
        open: true,
        message: errorMessage, // Set the error message from the backend
        isError: true,          // Error flag to set color to red
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-1/3 h-96">
        <h2 className="text-2xl font-bold mb-4">Airline Company Login</h2>

        {/* Snackbar component to display messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}  // Show message for 3 seconds
          onClose={() => setSnackbar({ ...snackbar, open: false })}  // Close snackbar
          message={snackbar.message}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          ContentProps={{
            sx: {
              backgroundColor: snackbar.isError ? "error.main" : "success.main", // Red if error, green if success
            },
          }}
        />

        {/* Login Form */}
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
        </form>

        {/* Redirect to registration */}
        <p className="mt-4 text-center">
          Don{"'"}t have an account yet?{" "}
          <button
            onClick={() => {
              navigate("/airline/register");
            }}
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
