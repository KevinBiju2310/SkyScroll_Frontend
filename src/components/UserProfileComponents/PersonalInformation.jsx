import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Save } from "lucide-react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import axiosInstance from "../../config/axiosInstance";
import { updateUserProfile } from "../../redux/userSlice";

const PersonalInformation = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    username: "",
    phone: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [passportDetails, setPassportDetails] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        email: user.email || "",
        username: user.username || "",
        phone: user.phone || "",
      });
    }

    if (user.passportDetails) {
      setPassportDetails({
        firstName: user.passportDetails.firstName || "",
        lastName: user.passportDetails.lastName || "",
        dateOfBirth: user.passportDetails.dateOfBirth
          ? new Date(user.passportDetails.dateOfBirth)
              .toISOString()
              .split("T")[0]
          : "",
        nationality: user.passportDetails.nationality || "",
        passportNumber: user.passportDetails.passportNumber || "",
        expiryDate: user.passportDetails.expiryDate
          ? new Date(user.passportDetails.expiryDate)
              .toISOString()
              .split("T")[0]
          : "",
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handlePassportDetailsChange = (e) => {
    setPassportDetails({ ...passportDetails, [e.target.name]: e.target.value });
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...personalInfo,
    };
    try {
      const response = await axiosInstance.put("/profile", data);
      console.log("Personal info updated:", response.data.data);
      dispatch(updateUserProfile(response.data.data));
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating personal info:", error);
    }
  };

  const handlePassportDetailsSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...passportDetails,
    };
    try {
      const response = await axiosInstance.put("/passport", data);
      console.log("Passport info updated: ", response);
    } catch (error) {
      console.error("Error updating passport details:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 8, px: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#333", fontWeight: 600 }}
        >
          Personal Information
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Update your personal details below.
        </Typography>

        <form onSubmit={handlePersonalInfoSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={personalInfo.username}
                onChange={handlePersonalInfoChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <SaveButton />
          </Box>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ top: 100 }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Saved Successfully!
          </Alert>
        </Snackbar>

        <Box sx={{ mt: 5, pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#333", fontWeight: 600 }}
          >
            Passport Details
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Please enter your passport details below.
          </Typography>

          <form onSubmit={handlePassportDetailsSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={passportDetails.firstName}
                  onChange={handlePassportDetailsChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={passportDetails.lastName}
                  onChange={handlePassportDetailsChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={passportDetails.dateOfBirth}
                  onChange={handlePassportDetailsChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nationality"
                  name="nationality"
                  value={passportDetails.nationality}
                  onChange={handlePassportDetailsChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Passport Number"
                  name="passportNumber"
                  value={passportDetails.passportNumber}
                  onChange={handlePassportDetailsChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Passport Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={passportDetails.expiryDate}
                  onChange={handlePassportDetailsChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <SaveButton />
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

// SaveButton Component
const SaveButton = () => (
  <Button
    type="submit"
    variant="contained"
    color="primary"
    startIcon={<Save />}
    sx={{
      textTransform: "none",
      borderRadius: 2,
      backgroundColor: "#1976D2",
      "&:hover": {
        backgroundColor: "#155a9a",
      },
    }}
  >
    Save
  </Button>
);

export default PersonalInformation;
