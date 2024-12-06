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
import Popup from "../../components/PopUp";
import { DateTime } from "luxon";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [tripToEdit, setTripToEdit] = useState(null);
  const [editData, setEditData] = useState({
    arrivalTime: "",
    departureTime: "",
    status: "",
    ticketPrices: {},
  });
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

  const convertToTimezone = (dateStr, timezone) => {
    return DateTime.fromISO(dateStr, { zone: "utc" })
      .setZone(timezone) // Convert from UTC to the airport's timezone
      .toFormat("yyyy-MM-dd'T'HH:mm"); // Format it for input type datetime-local
  };

  const handleEditTrip = (trip) => {
    setTripToEdit(trip);
    const segment = trip.segments[0] || {};

    // Convert times to the airport's timezone
    const departureTimeFormatted = convertToTimezone(
      segment.departureTime,
      segment.departureAirport?.timezone || "UTC"
    );
    const arrivalTimeFormatted = convertToTimezone(
      segment.arrivalTime,
      segment.arrivalAirport?.timezone || "UTC"
    );

    setEditData({
      departureTime: departureTimeFormatted,
      arrivalTime: arrivalTimeFormatted,
      status: segment.status || "",
      ticketPrices: trip.ticketPrices || {},
    });
    setEditModalOpen(true);
  };

  const confirmDeleteTrip = (tripId) => {
    setTripToDelete(tripId);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTrip = {
        ...tripToEdit,
        segments: [
          {
            ...tripToEdit.segments[0],
            arrivalTime: editData.arrivalTime,
            departureTime: editData.departureTime,
            status: editData.status,
          },
        ],
        ticketPrices: editData.ticketPrices,
      };

      const response = await axiosInstance.put(
        `/airline/edit-trip/${tripToEdit._id}`,
        updatedTrip
      );

      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripToEdit._id ? response.data.response : trip
        )
      );

      setEditModalOpen(false);
      setTripToEdit(null);
    } catch (err) {
      console.error("Error updating trip:", err);
      alert("Failed to save changes");
    }
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

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setTripToEdit(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setTripToDelete(null);
  };

  const displayDate = (dateStr, timezone) =>
    DateTime.fromISO(dateStr, { zone: "utc" })
      .setZone(timezone)
      .toLocaleString(DateTime.DATETIME_MED);

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
                      onClick={() => handleEditTrip(trip)}
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
                            {displayDate(
                              segment.departureTime,
                              segment.departureAirport?.timezone || "UTC"
                            )}
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
                            {displayDate(
                              segment.arrivalTime,
                              segment.arrivalAirport?.timezone || "UTC"
                            )}
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

        <Popup isOpen={editModalOpen} onClose={handleCancelEdit}>
          <h3 className="text-xl font-semibold mb-4">Edit Trip</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Arrival Time</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded"
                value={editData.arrivalTime}
                onChange={(e) =>
                  setEditData({ ...editData, arrivalTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Departure Time
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded"
                value={editData.departureTime}
                onChange={(e) =>
                  setEditData({ ...editData, departureTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
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
            <div>
              <label className="block text-sm font-medium">Ticket Prices</label>
              <div className="space-y-2">
                {Object.entries(editData.ticketPrices).map(
                  ([classType, price]) => (
                    <div key={classType} className="flex items-center gap-4">
                      <span className="w-1/4">{classType}</span>
                      <input
                        type="number"
                        className="w-3/4 px-3 py-2 border rounded"
                        value={price}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            ticketPrices: {
                              ...editData.ticketPrices,
                              [classType]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </Popup>

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
