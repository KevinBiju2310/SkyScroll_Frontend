/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { AdminLayout } from "../../components/AdminLayout";
import { Plane } from "lucide-react";

const FlightCard = ({ trip }) => {
  const ticketPrices = trip.ticketPrices;

  return (
    <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center">
        {/* Left Section - Airline Info */}
        <div className="w-1/4">
          <div className="flex items-center gap-3">
            {trip.airline.profilepic ? (
              <img
                src={trip.airline.profilepic}
                alt={`${trip.airline.airlineName} Logo`}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {trip.airline.airlineName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-700">
                {trip.airline.airlineName}
              </h2>
              <p className="text-xs text-gray-500">#{trip.airline.iataCode}</p>
            </div>
          </div>
        </div>

        {/* Middle Section - Flight Route for each segment */}
        <div className="flex flex-col items-center gap-4">
          {trip.segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-6">
              {/* Departure */}
              <div className="text-center min-w-[100px]">
                <p className="text-xl font-semibold text-gray-800">
                  {formatTime(segment.departureTime)}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {segment.departureAirport.code}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(segment.departureTime)}
                </p>
              </div>

              {/* Flight Duration */}
              <div className="flex flex-col items-center gap-1 min-w-[150px]">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-[2px] bg-gray-300"></div>
                  <Plane className="w-5 h-5 text-blue-500" />
                  <div className="w-16 h-[2px] bg-gray-300"></div>
                </div>
                <p className="text-xs text-gray-500">
                  {calculateDuration(
                    segment.departureTime,
                    segment.arrivalTime
                  )}
                </p>
              </div>

              {/* Arrival */}
              <div className="text-center min-w-[100px]">
                <p className="text-xl font-semibold text-gray-800">
                  {formatTime(segment.arrivalTime)}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {segment.arrivalAirport.code}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(segment.arrivalTime)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section - Prices for Classes */}
        <div className="w-1/4 text-right">
          <div className="mb-2">
            <span className="text-xs text-gray-500">Prices</span>
          </div>
          {Object.entries(ticketPrices).map(([classType, price]) => (
            <div key={classType} className="mb-1">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {classType}:
              </span>{" "}
              <span className="text-lg font-bold text-blue-600">
                ₹{price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Utility Functions
const formatDate = (dateString) => {
  const options = { month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateDuration = (departureTime, arrivalTime) => {
  const dep = new Date(departureTime);
  const arr = new Date(arrivalTime);
  const diff = Math.abs(arr - dep); // in ms

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const FlightSchedules = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const response = await axiosInstance.get("/admin/trips");
        console.log(response.data.response);
        setTrips(response.data.response);
      } catch (error) {
        console.error("Error occurred", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTrips();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Flight Schedules</h1>
          <div className="flex space-x-4">
            <span className="text-sm text-gray-500">
              Total Flights: {trips.length}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {trips.map((trip) => (
            <FlightCard key={trip._id} trip={trip} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FlightSchedules;
