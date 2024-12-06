import { useState, useEffect } from "react";
import AirlineLayout from "../../components/AirlineSidebar";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddTrips = () => {
  const [tripData, setTripData] = useState({
    isDirect: true,
    status: "scheduled",
    ticketPrices: {},
    segments: [
      {
        flightNumber: "",
        departureAirport: "",
        arrivalAirport: "",
        departureTime: "",
        arrivalTime: "",
        departureTerminal: "",
        arrivalTerminal: "",
        departureGate: "",
        arrivalGate: "",
        aircraft: "",
      },
    ],
  });

  const [stops, setStops] = useState();
  const [aircraftModels, setAircraftModels] = useState([]);
  const [airportModels, setAirportModels] = useState([]);
  const [terminalsAndGates, setTerminalsAndGates] = useState({});
  const [ticketClasses, setTicketClasses] = useState([]);
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
        setAirportModels(response.data.response);
        const terminalsData = {};
        for (const airport of response.data.response) {
          terminalsData[airport.name] = airport.terminals || [];
        }
        setTerminalsAndGates(terminalsData);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };

    fetchAircraftModels();
    fetchAirportModels();
  }, []);

  useEffect(() => {
    const updateSegments = () => {
      const newSegments = Array.from(
        { length: tripData.isDirect ? 1 : stops + 1 },
        () => ({
          flightNumber: "",
          departureAirport: "",
          arrivalAirport: "",
          departureTime: "",
          arrivalTime: "",
          departureTerminal: "",
          arrivalTerminal: "",
          departureGate: "",
          arrivalGate: "",
          aircraft: "",
        })
      );
      setTripData((prevData) => ({ ...prevData, segments: newSegments }));
    };

    updateSegments();
  }, [tripData.isDirect, stops]);

  const handleAircraftChange = (e, index) => {
    const selectedAircraft = e.target.value;
    const selectedModel = aircraftModels.find(
      (aircraft) => aircraft.aircraftModel === selectedAircraft
    );
    const classes = selectedModel?.classConfig || [];
    setTicketClasses(classes);
    const initialTicketPrices = {};
    classes.forEach((cls) => {
      initialTicketPrices[cls] = "";
    });
    setTripData((prevData) => {
      const newSegments = [...prevData.segments];
      newSegments[index] = {
        ...newSegments[index],
        aircraft: selectedAircraft,
      };
      return {
        ...prevData,
        segments: newSegments,
        ticketPrices: initialTicketPrices,
      };
    });
  };

  const handleTerminalChange = (e, index, terminalType, gateType) => {
    const terminal = e.target.value;
    setTripData((prevData) => {
      const newSegments = [...prevData.segments];
      newSegments[index][terminalType] = terminal;
      newSegments[index][gateType] = "";
      return { ...prevData, segments: newSegments };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/airline/add-trips", tripData);
      navigate("/airline/trips");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (event, index, field, subfield) => {
    const value = event.target.value;
    setTripData((prevData) => {
      const newSegments = [...prevData.segments];
      if (field === "segments") {
        newSegments[index] = {
          ...newSegments[index],
          [subfield]: value,
        };
      } else {
        prevData[field] = value;
      }
      return { ...prevData, segments: newSegments };
    });
  };
  // console.log(airportModels);
  // console.log(ticketClasses);
  return (
    <AirlineLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-8">Add New Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Flight Details */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Flight Details</h3>

            <div>
              <label className="block text-sm font-medium">Flight Type:</label>
              <select
                value={tripData.isDirect ? "direct" : "connecting"}
                onChange={(e) => {
                  const isDirect = e.target.value === "direct";
                  setTripData({ ...tripData, isDirect });
                  setStops(isDirect ? 0 : stops);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="direct">Direct Flight</option>
                <option value="connecting">Connecting Flight</option>
              </select>
            </div>

            {!tripData.isDirect && (
              <div>
                <label className="block text-sm font-medium">
                  Number of Stops:
                </label>
                <input
                  type="number"
                  value={stops}
                  onChange={(e) => setStops(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">
                Flight Status:
              </label>
              <select
                value={tripData.status}
                onChange={(e) =>
                  setTripData({ ...tripData, status: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ontime">On Time</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
                <option value="boarding">Boarding</option>
                <option value="inair">In Air</option>
                <option value="landed">Landed</option>
              </select>
            </div>
          </div>

          {/* Flight Segments */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Flight Segments</h3>
            {tripData.segments.map((segment, index) => (
              <div key={index} className="border p-4 rounded-md bg-gray-50">
                <h4 className="text-lg font-medium">Segment {index + 1}</h4>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Flight Number:
                    </label>
                    <input
                      type="text"
                      value={segment.flightNumber}
                      onChange={(e) =>
                        handleInputChange(e, index, "segments", "flightNumber")
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Aircraft:
                    </label>
                    <select
                      value={segment.aircraft}
                      onChange={(e) => handleAircraftChange(e, index)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Aircraft</option>
                      {aircraftModels.map((aircraft) => (
                        <option
                          key={aircraft._id}
                          value={aircraft.aircraftModel}
                        >
                          {aircraft.aircraftModel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Departure Airport:
                    </label>
                    <select
                      value={segment.departureAirport}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          index,
                          "segments",
                          "departureAirport"
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Airport</option>
                      {airportModels.map((airport) => (
                        <option key={airport._id} value={airport.name}>
                          {airport.name} ({airport.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Departure Terminal:
                    </label>
                    <select
                      value={segment.departureTerminal}
                      onChange={(e) =>
                        handleTerminalChange(
                          e,
                          index,
                          "departureTerminal",
                          "departureGate"
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!segment.departureAirport}
                    >
                      <option value="">Select Terminal</option>
                      {(terminalsAndGates[segment.departureAirport] || []).map(
                        (terminal) => (
                          <option
                            key={terminal._id}
                            value={terminal.terminalName}
                          >
                            {terminal.terminalName}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Departure Gate:
                    </label>
                    <select
                      value={segment.departureGate}
                      onChange={(e) =>
                        handleInputChange(e, index, "segments", "departureGate")
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!segment.departureTerminal}
                    >
                      <option value="">Select Gate</option>
                      {(
                        terminalsAndGates[segment.departureAirport]?.find(
                          (t) => t.terminalName === segment.departureTerminal
                        )?.gates || []
                      ).map((gate) => (
                        <option key={gate._id} value={gate.gateNumber}>
                          {gate.gateNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Arrival Airport:
                    </label>
                    <select
                      value={segment.arrivalAirport}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          index,
                          "segments",
                          "arrivalAirport"
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Airport</option>
                      {airportModels.map((airport) => (
                        <option key={airport._id} value={airport.name}>
                          {airport.name} ({airport.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Arrival Terminal:
                    </label>
                    <select
                      value={segment.arrivalTerminal}
                      onChange={(e) =>
                        handleTerminalChange(
                          e,
                          index,
                          "arrivalTerminal",
                          "arrivalGate"
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!segment.arrivalAirport}
                    >
                      <option value="">Select Terminal</option>
                      {(terminalsAndGates[segment.arrivalAirport] || []).map(
                        (terminal) => (
                          <option
                            key={terminal._id}
                            value={terminal.terminalName}
                          >
                            {terminal.terminalName}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Arrival Gate:
                    </label>
                    <select
                      value={segment.arrivalGate}
                      onChange={(e) =>
                        handleInputChange(e, index, "segments", "arrivalGate")
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!segment.arrivalTerminal}
                    >
                      <option value="">Select Gate</option>
                      {(
                        terminalsAndGates[segment.arrivalAirport]?.find(
                          (t) => t.terminalName === segment.arrivalTerminal
                        )?.gates || []
                      ).map((gate) => (
                        <option key={gate._id} value={gate.gateNumber}>
                          {gate.gateNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Departure Time:
                    </label>
                    <input
                      type="datetime-local"
                      value={segment.departureTime}
                      onChange={(e) =>
                        handleInputChange(e, index, "segments", "departureTime")
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Arrival Time:
                    </label>
                    <input
                      type="datetime-local"
                      value={segment.arrivalTime}
                      onChange={(e) =>
                        handleInputChange(e, index, "segments", "arrivalTime")
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Pricing */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Ticket Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              {ticketClasses.map((cls) => (
                <div key={cls}>
                  <label className="block text-sm font-medium capitalize">
                    {cls}:
                  </label>
                  <input
                    type="number"
                    value={tripData.ticketPrices[cls]}
                    onChange={(e) =>
                      setTripData((prevData) => ({
                        ...prevData,
                        ticketPrices: {
                          ...prevData.ticketPrices,
                          [cls]: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Trip
          </button>
        </form>
      </div>
    </AirlineLayout>
  );
};

export default AddTrips;
