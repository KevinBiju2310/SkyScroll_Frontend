import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import {
  Plane,
  Clock,
  Calendar,
  Building2,
  ArrowRight,
  Edit,
  XCircle,
} from "lucide-react";
import AirlineLayout from "../../components/AirlineSidebar";
import axiosInstance from "../../config/axiosInstance";
import ConfirmationModal from "../../components/ConfirmationModal";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Trips = () => {
  const [tripDetails, setTripDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const navigate = useNavigate();

  const handleAddTrip = () => {
    navigate("/airline/trips/addtrip");
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axiosInstance.get("/airline/trips");
        console.log(response);
        setTripDetails(response.data.response);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, []);

  const handleCancelTrip = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTrip) return;
    try {
      await axiosInstance.delete(`/airline/trips/${selectedTrip._id}`);
      setTripDetails(
        tripDetails.filter((trip) => trip._id !== selectedTrip._id)
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <AirlineLayout>
      <div className="p-6 max-w-10xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Trip Details</h1>
          <button
            className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
            onClick={handleAddTrip}
          >
            <FaPlus className="mr-2" />
            Add Trip
          </button>
        </div>

        {tripDetails.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            No trips scheduled
          </div>
        ) : (
          tripDetails.map((trip) => (
            <div
              key={trip._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 mb-6"
            >
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <Plane className="h-6 w-6 text-slate-800" />
                    </div>
                    <span className="text-lg font-semibold text-slate-800">
                      Flight - {trip.flightNumber}
                    </span>
                  </div>
                  <span className="px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium capitalize">
                    {trip.status}
                  </span>
                </div>

                <div className="flex justify-between items-center py-4">
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-slate-800">
                      {trip.departureAirport.name}
                    </div>
                    <div className="text-slate-500">
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(trip.departureTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Building2 className="h-4 w-4" />
                        <span>
                          Terminal {trip.departureTerminal} • Gate{" "}
                          {trip.departureGate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center px-8">
                    <div className="text-slate-400 text-sm">
                      {trip.duration}
                    </div>
                    <div className="w-32 h-px bg-slate-300 my-2 relative">
                      <ArrowRight className="absolute top-1/2 right-0 h-4 w-4 text-slate-400 -translate-y-1/2" />
                    </div>
                    <div className="text-slate-400 text-sm"></div>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="text-3xl font-bold text-slate-800">
                      {trip.arrivalAirport.name}
                    </div>
                    <div className="text-slate-500">
                      <div className="flex items-center justify-end space-x-2 mt-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(trip.arrivalTime)}</span>
                      </div>
                      <div className="flex items-center justify-end space-x-2 mt-1">
                        <Building2 className="h-4 w-4" />
                        <span>
                          Terminal {trip.arrivalTerminal} • Gate{" "}
                          {trip.arrivalGate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-slate-800" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Flight Date</div>
                      <div className="font-medium text-slate-700">
                        {formatDate(trip.departureTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Trip
                    </button>
                    <button
                      onClick={() => handleCancelTrip(trip)}
                      className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <ConfirmationModal
          isOpen={isModalOpen}
          message="Are you sure you want to cancel this trip?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </AirlineLayout>
  );
};

export default Trips;
