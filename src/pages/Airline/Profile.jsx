import { useState } from "react";
import AirlineLayout from "../../components/AirlineSidebar";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Container,
  Snackbar,
  Alert,
  Link,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { PictureAsPdf as PdfIcon } from "@mui/icons-material";
import axiosInstance from "../../config/axiosInstance";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/userSlice";

const Profile = () => {
  const airline = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    username: airline.username,
    email: airline.email,
    phone: airline.phone,
    airlineName: airline.airlineName,
    designation: airline.designation,
    licenseDocument: airline.licenseDocument,
    insuranceDocument: airline.insuranceDocument,
    logoUrl: airline.logoUrl || "", // Initialize logo URL
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await axiosInstance.post(
        "/airline/upload-logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile((prev) => ({ ...prev, logoUrl: response.data.url }));
      setSnackbar({
        open: true,
        message: "Logo uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      setSnackbar({
        open: true,
        message: "Failed to upload logo.",
        severity: "error",
      });
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const profileDataToSend = {
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      airlineName: profile.airlineName,
      designation: profile.designation,
      logoUrl: profile.logoUrl,
    };
    try {
      const response = await axiosInstance.put(
        "/airline/profile",
        profileDataToSend
      );
      dispatch(updateUserProfile(response.data.data));
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile. Please try again.",
        severity: "error",
      });
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmNewPassword
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setSnackbar({
        open: true,
        message: "New passwords do not match.",
        severity: "error",
      });
      return;
    }
    try {
      const passwordData = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };
      const response = await axiosInstance.put(
        "/airline/change-password",
        passwordData
      );
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Password changed successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to change password. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const DocumentLink = ({ url, title }) => (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        color: "primary.main",
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
      }}
    >
      <PdfIcon sx={{ mr: 1 }} />
      {title}
    </Link>
  );

  return (
    <AirlineLayout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <form onSubmit={handleSubmitProfile}>
              <Grid container spacing={2}>
                {Object.entries(profile).map(([key, value]) => {
                  if (["licenseDocument", "insuranceDocument"].includes(key)) {
                    return (
                      <Grid item xs={12} key={key}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ minWidth: 200 }}>
                            {key === "licenseDocument"
                              ? "License"
                              : "Insurance Certificate"}
                            :
                          </Typography>
                          <DocumentLink
                            url={value}
                            title={
                              key === "licenseDocument"
                                ? "View License"
                                : "View Insurance Certificate"
                            }
                          />
                        </Box>
                      </Grid>
                    );
                  }
                  if (key === "logoUrl") {
                    return (
                      <Grid item xs={12} key={key}>
                        <Typography>Upload Airline Logo</Typography>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                        {value && (
                          <img src={value} alt="Airline Logo" width="100" />
                        )}
                      </Grid>
                    );
                  }
                  return (
                    <Grid item xs={12} sm={6} key={key}>
                      <TextField
                        fullWidth
                        label={key.replace(/([A-Z])/g, " $1").trim()}
                        name={key}
                        value={value}
                        onChange={handleProfileChange}
                        variant="outlined"
                      />
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Save Profile
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handleSubmitPasswordChange}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AirlineLayout>
  );
};

export default Profile;
