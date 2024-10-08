import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { TextField, Button, Grid, Typography, Box, Paper } from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

const PersonalInformation = () => {
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    username: "",
    phone: "",
    dateOfBirth: "",
  });

  const [passportDetails, setPassportDetails] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    expiryDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        const data = response.data.data;
        // console.log(data.email);
        setPersonalInfo({
          email: data.email || "",
          username: data.username || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth || "",
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handlePassportDetailsChange = (e) => {
    setPassportDetails({ ...passportDetails, [e.target.name]: e.target.value });
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/profile", personalInfo);
      console.log("Personal info updated:", response.data);
    } catch (error) {
      console.error("Error updating personal info:", error);
    }
    console.log("Saving personal info:", personalInfo);
  };

  const handlePassportDetailsSubmit = (e) => {
    e.preventDefault();
    console.log("Saving passport details:", passportDetails);
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
                name="phoneNumber"
                value={personalInfo.phoneNumber}
                onChange={handlePersonalInfoChange}
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
                value={personalInfo.dateOfBirth}
                onChange={handlePersonalInfoChange}
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
