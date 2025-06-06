import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../../config/axiosInstance";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;

const TIMEZONE_API_KEY = import.meta.env.VITE_TIMEZONE_API;

const AddAirport = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [airport, setAirport] = useState({
    name: "",
    code: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    timezone: "",
    terminals: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geocoder = useRef(null);

  const fetchTimeZone = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`
      );

      const { zoneName } = response.data; // Extract timezone

      setAirport((prev) => ({
        ...prev,
        timezone: zoneName, // Set the timezone in state
      }));
    } catch (error) {
      console.error("Error fetching timezone:", error);
      setErrorMessage("Could not fetch timezone. Please try again.");
      setSnackbarOpen(true);
    }
  };
  // Mapbox Initialization
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 1,
    });

    geocoder.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      types: "poi",
      marker: false,
    });

    map.current.addControl(geocoder.current);

    geocoder.current.on("result", (e) => {
      const [lng, lat] = e.result.center;
      const placeName = e.result.place_name;
      const parts = placeName.split(", ");
      const airportName = parts[0];
      const city = parts[1] || "";
      const country = parts[parts.length - 1] || "";

      setAirport((prev) => ({
        ...prev,
        name: airportName,
        city: city,
        country: country,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
      fetchTimeZone(lat, lng);

      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current);
      map.current.flyTo({
        center: [lng, lat],
        zoom: 10,
      });
    });

    return () => map.current.remove();
  }, []);

  // Function to fetch time zone based on latitude and longitude

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAirport((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTerminal = () => {
    setAirport((prev) => ({
      ...prev,
      terminals: [...prev.terminals, { terminalName: "", gates: [] }],
    }));
  };

  const handleTerminalChange = (index, value) => {
    const newTerminals = [...airport.terminals];
    newTerminals[index].terminalName = value;
    setAirport((prev) => ({ ...prev, terminals: newTerminals }));
  };

  // Add a gate to a terminal
  const handleAddGate = (terminalIndex) => {
    const newTerminals = [...airport.terminals];
    newTerminals[terminalIndex].gates.push({ gateNumber: "" });
    setAirport((prev) => ({ ...prev, terminals: newTerminals }));
  };

  const handleGateChange = (terminalIndex, gateIndex, value) => {
    const newTerminals = [...airport.terminals];
    newTerminals[terminalIndex].gates[gateIndex].gateNumber = value;
    setAirport((prev) => ({ ...prev, terminals: newTerminals }));
  };

  const validateStep1 = () => {
    const { name, city, country, latitude, longitude, code } = airport;

    if (!name && !city && !country && !latitude && !longitude) {
      setErrorMessage("Please select airport from map.");
      setSnackbarOpen(true); // Open Snackbar
      return false;
    }

    if (!code) {
      setErrorMessage("Please fill in all fields.");
      setSnackbarOpen(true); // Open Snackbar
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    for (let terminal of airport.terminals) {
      if (!terminal.terminalName) {
        setErrorMessage("Please fill in the terminal name.");
        setSnackbarOpen(true); // Open Snackbar
        return false;
      }
      for (let gate of terminal.gates) {
        if (!gate.gateNumber) {
          setErrorMessage("Please fill in the gate number.");
          setSnackbarOpen(true); // Open Snackbar
          return false;
        }
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axiosInstance.post("/admin/addairport", airport);
      console.log("Airport added:", response.data);
      navigate("/admin/airports");
    } catch (error) {
      const errorResponse = error.response?.data?.error || error.message;
      setErrorMessage(errorResponse);
      setSnackbarOpen(true);
      console.error(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <AdminLayout>
      <Box p={6}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Add New Airport
          </Typography>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Box
                    ref={mapContainer}
                    style={{ height: "400px", width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="name"
                    label="Airport Name"
                    value={airport.name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="code"
                    label="Airport Code"
                    value={airport.code}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="city"
                    label="City"
                    value={airport.city}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="country"
                    label="Country"
                    value={airport.country}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="latitude"
                    label="Latitude"
                    type="number"
                    value={airport.latitude}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="longitude"
                    label="Longitude"
                    type="number"
                    value={airport.longitude}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="timezone"
                    label="Time Zone"
                    value={airport.timezone}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            )}

            {step === 2 && (
              <Grid container spacing={4}>
                {airport.terminals.map((terminal, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      name={`terminal-${index}`}
                      label={`Terminal ${index + 1} Name`}
                      value={terminal.terminalName}
                      onChange={(e) =>
                        handleTerminalChange(index, e.target.value)
                      }
                      required
                      fullWidth
                    />
                    {terminal.gates.map((gate, gateIndex) => (
                      <TextField
                        key={gateIndex}
                        name={`gate-${index}-${gateIndex}`}
                        label={`Gate ${gateIndex + 1} Number`}
                        value={gate.gateNumber}
                        onChange={(e) =>
                          handleGateChange(index, gateIndex, e.target.value)
                        }
                        required
                        fullWidth
                        sx={{ mt: 2 }}
                      />
                    ))}
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => handleAddGate(index)}
                    >
                      Add Gate
                    </Button>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleAddTerminal}>
                    Add Terminal
                  </Button>
                </Grid>
              </Grid>
            )}

            <Box mt={4}>
              {step > 1 && (
                <Button variant="contained" onClick={prevStep}>
                  Previous
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={nextStep}
                sx={{ ml: 2 }}
                disabled={loading}
              >
                {step === 1 ? "Next" : "Submit"}
              </Button>
            </Box>
          </form>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default AddAirport;
