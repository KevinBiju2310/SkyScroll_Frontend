import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox styles
import { AdminLayout } from "../../components/AdminLayout";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2t5c2Nyb2xsIiwiYSI6ImNtMjdmcDVsdjBua3kybHM2Yjg5eHFjZW8ifQ.DDjEvia0H06UVd5hFCzGPw";

const UpdateAirport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [airportData, setAirportData] = useState({
    name: "",
    code: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    terminals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch airport data by ID when the component mounts
  useEffect(() => {
    const fetchAirport = async () => {
      try {
        console.log(id);
        const response = await axiosInstance.get(`/admin/airports/${id}`);
        console.log(response);
        setAirportData(response.data.response);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load airport details.");
        setLoading(false);
      }
    };

    fetchAirport();
  }, [id]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAirportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle terminal and gate updates
  const handleTerminalChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTerminals = [...airportData.terminals];
    updatedTerminals[index][name] = value;
    setAirportData({ ...airportData, terminals: updatedTerminals });
  };

  const handleGateChange = (terminalIndex, gateIndex, event) => {
    const { value } = event.target;
    const updatedTerminals = [...airportData.terminals];
    updatedTerminals[terminalIndex].gates[gateIndex].gateNumber = value;
    setAirportData({ ...airportData, terminals: updatedTerminals });
  };

  const handleAddTerminal = () => {
    setAirportData({
      ...airportData,
      terminals: [...airportData.terminals, { terminalName: "", gates: [] }],
    });
  };

  const handleAddGate = (terminalIndex) => {
    const updatedTerminals = [...airportData.terminals];
    updatedTerminals[terminalIndex].gates.push({ gateNumber: "" });
    setAirportData({ ...airportData, terminals: updatedTerminals });
  };

  // Handle form submission to update airport
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/airports/${id}`, airportData);
      //   alert("Airport updated successfully!");
      navigate("/admin/airports"); // Navigate back to the airport list
    } catch (err) {
      alert("Airport name exists")
      setError(err.message || "Failed to update airport");
    }
  };

  if (loading) return <p>Loading airport details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Update Airport</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-lg font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={airportData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold">Code</label>
            <input
              type="text"
              name="code"
              value={airportData.code}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={airportData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold">Country</label>
            <input
              type="text"
              name="country"
              value={airportData.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={airportData.latitude}
              onChange={handleChange}
              required
              step="0.0001"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={airportData.longitude}
              onChange={handleChange}
              required
              step="0.0001"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Terminals</h4>
            {airportData.terminals.map((terminal, terminalIndex) => (
              <div key={terminalIndex} className="mb-4 p-4 border rounded-lg">
                <label className="block mb-2 font-semibold">
                  Terminal Name
                </label>
                <input
                  type="text"
                  name="terminalName"
                  value={terminal.terminalName}
                  onChange={(event) =>
                    handleTerminalChange(terminalIndex, event)
                  }
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                <h5 className="font-semibold mb-2">Gates</h5>
                {terminal.gates.map((gate, gateIndex) => (
                  <div key={gateIndex} className="mb-2">
                    <label className="block">Gate {gateIndex + 1}</label>
                    <input
                      type="text"
                      value={gate.gateNumber}
                      onChange={(event) =>
                        handleGateChange(terminalIndex, gateIndex, event)
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddGate(terminalIndex)}
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Add Gate
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddTerminal}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Add Terminal
            </button>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Update Airport
            </button>
          </div>
        </form>

        {/* MapBox integration */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Location Map</h3>
          <div className="h-[400px] w-full">
            <Map
              initialViewState={{
                longitude: airportData.longitude,
                latitude: airportData.latitude,
                zoom: 12,
              }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              <Marker
                longitude={airportData.longitude}
                latitude={airportData.latitude}
                color="red"
              />
            </Map>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateAirport;
