import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { Plane, X, Edit, Trash2 } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup as LeafletPopup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ConfirmationModal from "../../components/ConfirmationModal"; // Assuming this is the path to your ConfirmationModal

const Airports = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [airportToDelete, setAirportToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await axiosInstance.get("/admin/airports");
      setAirports(response.data.response);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load airports");
      setLoading(false);
    }
  };

  const handleAddAirport = () => {
    navigate("/admin/airports/addairport");
  };

  const handleViewDetails = (airport) => {
    setSelectedAirport(airport);
  };

  const handleClosePopup = () => {
    setSelectedAirport(null);
  };

  const handleOpenConfirmationModal = (airportId) => {
    setAirportToDelete(airportId);
    setIsConfirmationModalOpen(true);
  };

  const handleUpdateAirport = (airportId) => {
    navigate(`/admin/airports/updateairport/${airportId}`);
  };

  const handleDeleteAirport = async () => {
    try {
      setAirports(
        airports.filter((airport) => airport._id !== airportToDelete)
      );
      setIsConfirmationModalOpen(false);
      handleClosePopup();
      await axiosInstance.delete(`/admin/${airportToDelete}`);
      setAirportToDelete(null);
      // fetchAirports();
    } catch (err) {
      console.error("Failed to delete airport:", err);
      alert("Failed to delete airport. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading airports...</p>;
  if (error)
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Airports</h2>
          <button
            onClick={handleAddAirport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Add Airport
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airports.length > 0 ? (
            airports.map((airport) => (
              <div
                key={airport._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Plane className="mr-2 text-blue-500" />
                    <h3 className="text-xl font-semibold">{airport.name}</h3>
                  </div>
                  <p className="text-gray-600">
                    <strong>Code:</strong> {airport.code}
                  </p>
                  <p className="text-gray-600">
                    <strong>City:</strong> {airport.city}
                  </p>
                  <p className="text-gray-600">
                    <strong>Country:</strong> {airport.country}
                  </p>
                </div>
                <div className="bg-gray-100 px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(airport)}
                    className="text-blue-500 hover:text-blue-600 font-semibold transition duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              No airports available
            </p>
          )}
        </div>
      </div>
      {selectedAirport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold">{selectedAirport.name}</h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-2">
                  <strong>Code:</strong> {selectedAirport.code}
                </p>
                <p className="mb-2">
                  <strong>City:</strong> {selectedAirport.city}
                </p>
                <p className="mb-2">
                  <strong>Country:</strong> {selectedAirport.country}
                </p>
                <p className="mb-2">
                  <strong>Latitude:</strong> {selectedAirport.latitude}
                </p>
                <p className="mb-2">
                  <strong>Longitude:</strong> {selectedAirport.longitude}
                </p>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">Terminals</h4>
                  {selectedAirport.terminals &&
                  selectedAirport.terminals.length > 0 ? (
                    selectedAirport.terminals.map((terminal, tIndex) => (
                      <div key={tIndex} className="mb-4 p-3 border rounded-md">
                        <p className="font-semibold">
                          Terminal: {terminal.terminalName}
                        </p>
                        {terminal.gates && terminal.gates.length > 0 ? (
                          <div className="mt-2">
                            <p className="font-semibold">Gates:</p>
                            <ul className="list-disc list-inside">
                              {terminal.gates.map((gate, gIndex) => (
                                <li key={gIndex} className="ml-4">
                                  Gate: {gate.gateNumber}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>No gates available for this terminal</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No terminals available for this airport</p>
                  )}
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => handleUpdateAirport(selectedAirport._id)}
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    <Edit size={18} className="mr-2" />
                    Update
                  </button>
                  <button
                    onClick={() =>
                      handleOpenConfirmationModal(selectedAirport._id)
                    }
                    className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
              <div className="h-[400px]">
                <MapContainer
                  center={[selectedAirport.latitude, selectedAirport.longitude]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[
                      selectedAirport.latitude,
                      selectedAirport.longitude,
                    ]}
                  >
                    <LeafletPopup>
                      <b>{selectedAirport.name}</b>
                      <br />
                      {selectedAirport.city}, {selectedAirport.country}
                    </LeafletPopup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={handleDeleteAirport}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message="Are you sure you want to delete this airport?"
      />
    </AdminLayout>
  );
};

export default Airports;
