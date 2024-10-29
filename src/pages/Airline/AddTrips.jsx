import { useState, useEffect } from "react";
import AirlineLayout from "../../components/AirlineSidebar";
import {
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddTrips = () => {
  // State for form data
  const [tripData, setTripData] = useState({
    flightNumber: "",
    aircraftModel: "",
    flightStatus: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTerminal: "",
    arrivalTerminal: "",
    departureGate: "",
    arrivalGate: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    recurrenceType: "specificDate",
    recurringDays: [],
    ticketPrices: {},
  });
  const [aircraftModels, setAircraftModels] = useState([]);
  const [selectedClassConfig, setSelectedClassConfig] = useState([]);
  const [airportModels, setAirportModels] = useState([]);
  const [departureTerminals, setDepartureTerminals] = useState([]);
  const [arrivalTerminals, setArrivalTerminals] = useState([]);
  const [departureGates, setDepartureGates] = useState([]);
  const [arrivalGates, setArrivalGates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAircraftModels = async () => {
      try {
        const response = await axiosInstance.get("/airline/aircrafts");
        const approvedAircrafts = response.data.response.filter(
          (aircraft) => aircraft.approvalStatus === "approved"
        );
        setAircraftModels(approvedAircrafts);
      } catch (error) {
        console.error("Error fetching aircraft models:", error);
      }
    };

    const fetchAirportModels = async () => {
      try {
        const response = await axiosInstance.get("/airline/airports");
        const airportData = response.data.response.map((airport) => ({
          name: airport.name,
          code: airport.code,
          terminals: airport.terminals,
        }));
        setAirportModels(airportData);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };

    fetchAircraftModels();
    fetchAirportModels();
  }, []);

  // Flight status options
  const flightStatuses = [
    "Scheduled",
    "On Time",
    "Delayed",
    "Cancelled",
    "Boarding",
    "In Air",
    "Landed",
  ];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleInputChange = (field, value) => {
    setTripData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "aircraftModel") {
      const selectedModel = aircraftModels.find(
        (model) => model.aircraftModel === value
      );
      if (selectedModel) {
        setSelectedClassConfig(selectedModel.classConfig);
        const newTicketPrices = {};
        selectedModel.classConfig.forEach((classType) => {
          newTicketPrices[classType] = "";
        });
        setTripData((prev) => ({
          ...prev,
          ticketPrices: newTicketPrices,
        }));
      } else {
        setSelectedClassConfig([]);
      }
    }
  };

  const handleDepartureAirportChange = (value) => {
    setTripData((prev) => ({
      ...prev,
      departureAirport: value,
      departureTerminal: "",
      departureGate: "",
    }));

    const selectedAirport = airportModels.find(
      (airport) => airport.code === value
    );
    setDepartureTerminals(selectedAirport ? selectedAirport.terminals : []);
  };

  const handleArrivalAirportChange = (value) => {
    setTripData((prev) => ({
      ...prev,
      arrivalAirport: value,
      arrivalTerminal: "",
      arrivalGate: "",
    }));

    const selectedAirport = airportModels.find(
      (airport) => airport.code === value
    );
    setArrivalTerminals(selectedAirport ? selectedAirport.terminals : []);
  };

  const handleDepartureTerminalChange = (value) => {
    setTripData((prev) => ({
      ...prev,
      departureTerminal: value,
      departureGate: "",
    }));

    const selectedTerminal = departureTerminals.find(
      (terminal) => terminal.terminalName === value
    );
    setDepartureGates(selectedTerminal ? selectedTerminal.gates : []);
  };

  const handleArrivalTerminalChange = (value) => {
    setTripData((prev) => ({
      ...prev,
      arrivalTerminal: value,
      arrivalGate: "",
    }));

    const selectedTerminal = arrivalTerminals.find(
      (terminal) => terminal.terminalName === value
    );
    setArrivalGates(selectedTerminal ? selectedTerminal.gates : []);
  };

  const handlePriceChange = (classType, value) => {
    setTripData((prev) => ({
      ...prev,
      ticketPrices: {
        ...prev.ticketPrices,
        [classType]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/airline/add-trips", tripData);
      navigate("/airline/trips");
      console.log(response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleRecurrenceChange = (event) => {
    const value = event.target.value;
    setTripData((prev) => ({
      ...prev,
      recurrenceType: value,
      recurringDays: value === "specificDate" ? [] : prev.recurringDays,
    }));
  };

  const handleDaysChange = (event) => {
    const {
      target: { value },
    } = event;
    setTripData((prev) => ({
      ...prev,
      recurringDays: typeof value === "string" ? value.split(",") : value,
    }));
  };
  console.log(aircraftModels);
  return (
    <AirlineLayout>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        {/* Flight Information Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Flight Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Flight Number"
                  value={tripData.flightNumber}
                  onChange={(e) =>
                    handleInputChange("flightNumber", e.target.value)
                  }
                  placeholder="e.g., AA1234"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Aircraft Model</InputLabel>
                  <Select
                    value={tripData.aircraftModel}
                    label="Aircraft Model"
                    onChange={(e) =>
                      handleInputChange("aircraftModel", e.target.value)
                    }
                  >
                    {aircraftModels.map((model) => (
                      <MenuItem key={model._id} value={model.aircraftModel}>
                        {model.aircraftModel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Flight Status</InputLabel>
                  <Select
                    value={tripData.flightStatus}
                    label="Flight Status"
                    onChange={(e) =>
                      handleInputChange("flightStatus", e.target.value)
                    }
                  >
                    {flightStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Route Details Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Route Details
            </Typography>
            <Grid container spacing={3}>
              {/* Departure Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Departure
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Departure Airport</InputLabel>
                      <Select
                        value={tripData.departureAirport}
                        onChange={(e) =>
                          handleDepartureAirportChange(e.target.value)
                        }
                      >
                        {airportModels.map((airport) => (
                          <MenuItem key={airport.code} value={airport.code}>
                            {airport.name} ({airport.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Departure Terminal</InputLabel>
                      <Select
                        value={tripData.departureTerminal}
                        onChange={(e) =>
                          handleDepartureTerminalChange(e.target.value)
                        }
                        disabled={!tripData.departureAirport}
                      >
                        {departureTerminals.map((terminal) => (
                          <MenuItem
                            key={terminal._id}
                            value={terminal.terminalName}
                          >
                            {terminal.terminalName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Departure Gate</InputLabel>
                      <Select
                        value={tripData.departureGate}
                        onChange={(e) =>
                          handleInputChange("departureGate", e.target.value)
                        }
                        disabled={!tripData.departureTerminal} // Disable if no terminal selected
                      >
                        {departureGates.map((gate) => (
                          <MenuItem key={gate._id} value={gate.gateNumber}>
                            {gate.gateNumber}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Arrival Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Arrival
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Arrival Airport</InputLabel>
                      <Select
                        value={tripData.arrivalAirport}
                        onChange={(e) =>
                          handleArrivalAirportChange(e.target.value)
                        }
                      >
                        {airportModels.map((airport) => (
                          <MenuItem key={airport.code} value={airport.code}>
                            {airport.name} ({airport.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Arrival Terminal</InputLabel>
                      <Select
                        value={tripData.arrivalTerminal}
                        onChange={(e) =>
                          handleArrivalTerminalChange(e.target.value)
                        }
                        disabled={!tripData.arrivalAirport} // Disable if no airport selected
                      >
                        {arrivalTerminals.map((terminal) => (
                          <MenuItem
                            key={terminal._id}
                            value={terminal.terminalName}
                          >
                            {terminal.terminalName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Arrival Gate</InputLabel>
                      <Select
                        value={tripData.arrivalGate}
                        onChange={(e) =>
                          handleInputChange("arrivalGate", e.target.value)
                        }
                        disabled={!tripData.arrivalTerminal} // Disable if no terminal selected
                      >
                        {arrivalGates.map((gate) => (
                          <MenuItem key={gate._id} value={gate.gateNumber}>
                            {gate.gateNumber}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Time Details Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Time Details
            </Typography>
            <Grid container spacing={3}>
              {/* Departure Time */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Departure
                </Typography>
                <Grid container spacing={2}>
                  {/* Conditionally render date field for departure */}
                  {tripData.recurrenceType === "specificDate" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Departure Date"
                        value={tripData.departureDate}
                        onChange={(e) =>
                          handleInputChange("departureDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Departure Time"
                      value={tripData.departureTime}
                      onChange={(e) =>
                        handleInputChange("departureTime", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Arrival Time */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Arrival
                </Typography>
                <Grid container spacing={2}>
                  {/* Conditionally render date field for arrival */}
                  {tripData.recurrenceType === "specificDate" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Arrival Date"
                        value={tripData.arrivalDate}
                        onChange={(e) =>
                          handleInputChange("arrivalDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Arrival Time"
                      value={tripData.arrivalTime}
                      onChange={(e) =>
                        handleInputChange("arrivalTime", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Recurrence selection */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Recurrence</InputLabel>
                  <Select
                    value={tripData.recurrenceType}
                    onChange={handleRecurrenceChange}
                    label="Recurrence"
                  >
                    <MenuItem value="specificDate">Specific Date</MenuItem>
                    <MenuItem value="recurring">Recurring Weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Select days of the week if recurring */}
              {tripData.recurrenceType === "recurring" && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Days of the Week</InputLabel>
                    <Select
                      multiple
                      value={tripData.recurringDays}
                      onChange={handleDaysChange}
                      input={<OutlinedInput label="Days of the Week" />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {daysOfWeek.map((day) => (
                        <MenuItem key={day} value={day}>
                          <Checkbox
                            checked={tripData.recurringDays.includes(day)}
                          />
                          <ListItemText primary={day} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Ticket Pricing Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ticket Pricing
            </Typography>
            <Grid container spacing={3}>
              {/* Render fields based on class configuration */}
              {selectedClassConfig.map((classType) => (
                <Grid item xs={12} md={4} key={classType}>
                  <TextField
                    fullWidth
                    label={`${
                      classType.charAt(0).toUpperCase() + classType.slice(1)
                    } Class Price`}
                    value={tripData.ticketPrices[classType] || ""}
                    onChange={(e) =>
                      handlePriceChange(classType, e.target.value)
                    }
                    placeholder={`Enter ${classType} class price`}
                    type="number"
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Add Trip
          </Button>
        </Box>
      </Box>
    </AirlineLayout>
  );
};

export default AddTrips;
