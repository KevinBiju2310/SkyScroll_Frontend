import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Plane,
  Calendar,
  Clock,
  Building2,
  DoorOpen,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import AirlineLayout from "../../components/AirlineSidebar";
import ConfirmationModal from "../../components/ConfirmationModal";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axiosInstance.get("/airline/trips");
        setTrips(response.data.response);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleAddTrip = () => {
    navigate("/airline/trips/addtrip");
  };

  const handleEditTrip = (tripId) => {
    navigate(`/airline/trips/edit/${tripId}`);
  };

  const confirmDeleteTrip = (tripId) => {
    setTripToDelete(tripId);
    setDeleteModalOpen(true);
  };

  const handleDeleteTrip = async () => {
    if (tripToDelete) {
      try {
        await axiosInstance.delete(`/airline/trips/${tripToDelete}`);
        setTrips(trips.filter((trip) => trip._id !== tripToDelete));
        setDeleteModalOpen(false);
        setTripToDelete(null);
      } catch (err) {
        console.error("Error deleting trip:", err);
        alert("Failed to delete trip"); 
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setTripToDelete(null);
  };

  if (loading) {
    return (
      <AirlineLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="mt-2 text-gray-600">Loading trips...</p>
        </div>
      </AirlineLayout>
    );
  }

  if (error) {
    return (
      <AirlineLayout>
        <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
          <AlertCircle className="w-8 h-8 mb-2" />
          <span>{error}</span>
        </div>
      </AirlineLayout>
    );
  }

  return (
    <AirlineLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">All Trips</h2>
          <button
            onClick={handleAddTrip}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Trip
          </button>
        </div>

        {/* Vertical layout */}
        <div className="space-y-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Trip Details
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {trip.isDirect ? "Direct Flight" : "Multiple Segments"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTrip(trip._id)}
                      className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirmDeleteTrip(trip._id)}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {trip.segments.map((segment, index) => (
                  <div
                    key={segment._id}
                    className="mt-4 border border-gray-100 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Plane className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold text-gray-700">
                        Flight {segment.flightNumber}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium">
                            {segment.departureAirport?.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(
                              segment.departureTime
                            ).toLocaleDateString()}
                            <Clock className="w-4 h-4 ml-2" />
                            {new Date(
                              segment.departureTime
                            ).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <Building2 className="w-4 h-4" />
                            Terminal {segment.departureTerminal}
                            <DoorOpen className="w-4 h-4 ml-2" />
                            Gate {segment.departureGate}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Arrival</p>
                          <p className="font-medium">
                            {segment.arrivalAirport?.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(segment.arrivalTime).toLocaleDateString()}
                            <Clock className="w-4 h-4 ml-2" />
                            {new Date(segment.arrivalTime).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <Building2 className="w-4 h-4" />
                            Terminal {segment.arrivalTerminal}
                            <DoorOpen className="w-4 h-4 ml-2" />
                            Gate {segment.arrivalGate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {segment.status.charAt(0).toUpperCase() +
                          segment.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {segment.aircraft?.modelName}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Ticket Prices
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {Object.entries(trip.ticketPrices || {}).map(
                      ([classType, price]) =>
                        price ? (
                          <div
                            key={classType}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <span className="text-gray-600">
                              {classType.charAt(0).toUpperCase() +
                                classType.slice(1)}
                            </span>
                            <span className="font-semibold text-green-600">
                              ${price}
                            </span>
                          </div>
                        ) : null
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ConfirmationModal
          isOpen={deleteModalOpen}
          onConfirm={handleDeleteTrip}
          onCancel={handleCancelDelete}
          message="Are you sure you want to delete this trip?"
        />
      </div>
    </AirlineLayout>
  );
};

export default Trips;