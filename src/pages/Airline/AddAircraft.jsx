import { useState } from "react";
import AirlineLayout from "../../components/AirlineSidebar";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const AddAircraft = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [certificateFile, setCertificateFile] = useState(null);
  const [formData, setFormData] = useState({
    aircraftModel: "",
    manufacturer: "",
    yearOfManufacture: "",
    registrationNumber: "",
    serialNumber: "",
    engineManufacturer: "",
    engineModel: "",
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
    airworthinessCertificate: null,
    seatLayout: "",
    classConfig: [],
    seatingDetails: [],
  });

  const travelClassOptions = [
    { value: "economy", label: "Economy" },
    // { value: 'premium_economy', label: 'Premium Economy' },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCertificateFile(file);
    setFormData((prev) => ({
      ...prev,
      airworthinessCertificate: file,
    }));
  };

  const handleClassConfigChange = (event, newValue) => {
    const selectedClasses = newValue.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      classConfig: selectedClasses,
      seatingDetails: prev.seatingDetails.filter((detail) =>
        selectedClasses.includes(detail.class)
      ),
    }));
  };

  const handleSeatingDetailsChange = (classType, field, value) => {
    setFormData((prev) => {
      const updatedSeatingDetails = [...prev.seatingDetails];
      const classIndex = updatedSeatingDetails.findIndex(
        (detail) => detail.class === classType
      );

      if (classIndex === -1) {
        updatedSeatingDetails.push({
          class: classType,
          [field]: value,
        });
      } else {
        updatedSeatingDetails[classIndex] = {
          ...updatedSeatingDetails[classIndex],
          [field]: value,
        };
      }

      return {
        ...prev,
        seatingDetails: updatedSeatingDetails,
      };
    });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "airworthinessCertificate") {
        submitData.append(key, formData[key]);
      } else if (Array.isArray(formData[key])) {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    try {
      const response = await axiosInstance.post(
        "/airline/add-aircraft",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      navigate("/airline/aircrafts")
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const renderBasicDetails = () => (
    <Stack spacing={3}>
      <Typography variant="h6" color="primary">
        Basic Aircraft Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Aircraft Model"
            name="aircraftModel"
            value={formData.aircraftModel}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Year of Manufacture"
            name="yearOfManufacture"
            value={formData.yearOfManufacture}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Registration Number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Serial Number"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Stack>
  );

  const renderEngineInformation = () => (
    <Stack spacing={3}>
      <Typography variant="h6" color="primary">
        Engine Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Engine Manufacturer"
            name="engineManufacturer"
            value={formData.engineManufacturer}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Engine Model"
            name="engineModel"
            value={formData.engineModel}
            onChange={handleInputChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Last Maintenance Date"
            name="lastMaintenanceDate"
            value={formData.lastMaintenanceDate}
            onChange={handleInputChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Next Maintenance Date"
            name="nextMaintenanceDate"
            value={formData.nextMaintenanceDate}
            onChange={handleInputChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload Airworthiness Certificate
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {certificateFile && (
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={certificateFile.name}
                onDelete={() => {
                  setCertificateFile(null);
                  setFormData((prev) => ({
                    ...prev,
                    airworthinessCertificate: null,
                  }));
                }}
                deleteIcon={<DeleteIcon />}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Stack>
  );

  const renderSeatingInformation = () => (
    <Stack spacing={3}>
      <Typography variant="h6" color="primary">
        Seating Information
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Aircraft Seat Layout
          </Typography>
          <TextField
            fullWidth
            label="Seat Layout Configuration"
            name="seatLayout"
            value={formData.seatLayout}
            onChange={handleInputChange}
            variant="outlined"
            placeholder="e.g., 3-3-3"
            helperText="Format: number of seats from left to right (e.g., 3-3-3 means 3 seats - aisle - 3 seats - aisle - 3 seats)"
          />
        </CardContent>
      </Card>

      <Autocomplete
        multiple
        options={travelClassOptions}
        getOptionLabel={(option) => option.label}
        value={travelClassOptions.filter((option) =>
          formData.classConfig.includes(option.value)
        )}
        onChange={handleClassConfigChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select Travel Classes"
          />
        )}
      />

      {formData.classConfig.map((classType) => (
        <Card key={classType} variant="outlined">
          <CardContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ textTransform: "capitalize" }}
            >
              {classType.replace("_", " ")} Class Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Seats"
                  onChange={(e) =>
                    handleSeatingDetailsChange(
                      classType,
                      "totalSeats",
                      e.target.value
                    )
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Window Seat Price"
                  onChange={(e) =>
                    handleSeatingDetailsChange(
                      classType,
                      "windowPrice",
                      e.target.value
                    )
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Aisle Seat Price"
                  onChange={(e) =>
                    handleSeatingDetailsChange(
                      classType,
                      "aislePrice",
                      e.target.value
                    )
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Middle Seat Price"
                  onChange={(e) =>
                    handleSeatingDetailsChange(
                      classType,
                      "middlePrice",
                      e.target.value
                    )
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Free Seats"
                  onChange={(e) =>
                    handleSeatingDetailsChange(
                      classType,
                      "freeSeats",
                      e.target.value
                    )
                  }
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  const steps = [
    { label: "Basic Details", content: renderBasicDetails },
    { label: "Engine Information", content: renderEngineInformation },
    { label: "Seating Information", content: renderSeatingInformation },
  ];

  return (
    <AirlineLayout>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Add New Aircraft
        </Typography>

        <Paper sx={{ mb: 4, p: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {steps[activeStep].content()}

            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button type="submit" variant="contained" color="success">
                  Submit
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  color="primary"
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Box>
    </AirlineLayout>
  );
};

export default AddAircraft;
