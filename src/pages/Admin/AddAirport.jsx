import { useState } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Grid, Typography, Paper } from "@mui/material";
import axios from "axios";

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
    terminals: [],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset any previous error message

    try {
        
      // API call to add the airport
      const response = await axios.post(
        "http://localhost:5000/admin/addairport",
        airport,
        { withCredentials: true }
      );
      console.log(response);
      
      console.log("Airport added:", response.data);
      navigate("/admin/airports");
    } catch (error) {
      const errorResponse = error.response?.data?.message || error.message;
      setErrorMessage(`Failed to add airport: ${errorResponse}`);
      console.error(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <AdminLayout>
      <Box p={6}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Add New Airport
          </Typography>

          {/* Error Message */}
          {errorMessage && (
            <Typography color="error" variant="body1" gutterBottom>
              {errorMessage}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="name"
                    name="name"
                    label="Airport Name"
                    value={airport.name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="code"
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
                    id="city"
                    name="city"
                    label="City"
                    value={airport.city}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="country"
                    name="country"
                    label="Country"
                    value={airport.country}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="latitude"
                    name="latitude"
                    label="Latitude"
                    type="number"
                    step="any"
                    value={airport.latitude}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="longitude"
                    name="longitude"
                    label="Longitude"
                    type="number"
                    step="any"
                    value={airport.longitude}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}

            {step === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Terminals
                </Typography>
                {airport.terminals.map((terminal, tIndex) => (
                  <Box
                    key={tIndex}
                    mb={4}
                    p={2}
                    border={1}
                    borderColor="grey.300"
                    borderRadius={2}
                  >
                    <TextField
                      id={`terminal-${tIndex}`}
                      label="Terminal Name"
                      value={terminal.terminalName}
                      onChange={(e) =>
                        handleTerminalChange(tIndex, e.target.value)
                      }
                      fullWidth
                      margin="normal"
                    />
                    <Typography variant="subtitle1" gutterBottom>
                      Gates
                    </Typography>
                    {terminal.gates.map((gate, gIndex) => (
                      <TextField
                        key={gIndex}
                        label="Gate Number"
                        value={gate.gateNumber}
                        onChange={(e) =>
                          handleGateChange(tIndex, gIndex, e.target.value)
                        }
                        fullWidth
                        margin="dense"
                      />
                    ))}
                    <Button
                      onClick={() => handleAddGate(tIndex)}
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                    >
                      Add Gate
                    </Button>
                  </Box>
                ))}
                <Button
                  onClick={handleAddTerminal}
                  variant="contained"
                  color="primary"
                >
                  Add Terminal
                </Button>
              </Box>
            )}

            {/* Multi-Step Navigation */}
            <Box display="flex" justifyContent="space-between" mt={4}>
              {step > 1 && (
                <Button onClick={prevStep} variant="outlined">
                  Back
                </Button>
              )}
              {step < 2 && (
                <Button onClick={nextStep} variant="contained" color="primary">
                  Next
                </Button>
              )}
              {step === 2 && (
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Airport"}
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default AddAirport;
