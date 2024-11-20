import { AdminLayout } from "../../components/AdminLayout";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import Popup from "../../components/PopUp";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await axiosInstance.get("/admin/bookings");
        setBookings(response.data.response);
      } catch (error) {
        console.error("Error Occurred", error);
      }
    };
    fetchAllBookings();
  }, []);

  const openPopup = (booking) => {
    setSelectedBooking(booking);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      CONFIRMED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || statusColors.default;
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all flight bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500 text-lg">No bookings available</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                      Flight Details
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                      Route & Time
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                      Passengers & Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                      Booked By
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => {
                    const { flightId, passengers, bookingStatus, _id, userId } =
                      booking;
                    const { airline, segments } = flightId;
                    const flightNumber = segments[0].flightNumber;
                    const departure = segments[0].departureAirport.code;
                    const arrival =
                      segments[segments.length - 1].arrivalAirport.code;
                    const departureTime = new Date(
                      segments[0].departureTime
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const arrivalTime = new Date(
                      segments[segments.length - 1].arrivalTime
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr
                        key={_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900">
                                {airline.airlineName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Flight {flightNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {departure} → {arrival}
                            </div>
                            <div className="text-gray-500">
                              {departureTime} - {arrivalTime}
                            </div>
                            <div className="text-gray-500">
                              {new Date(
                                segments[0].departureTime
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900">
                              {passengers.length} Passengers
                            </div>
                            <span
                              className={`inline-flex mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                bookingStatus
                              )}`}
                            >
                              {bookingStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userId.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userId.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openPopup(booking)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Pass the booking details to the popup */}
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        {selectedBooking && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <div>
              <h3 className="font-medium text-lg">Flight Information</h3>
              <p>
                Flight Number:{" "}
                {selectedBooking.flightId?.segments[0].flightNumber}
              </p>
              <p>Airline: {selectedBooking.flightId?.airline.airlineName}</p>
              <p>
                From:{" "}
                {selectedBooking.flightId?.segments[0].departureAirport.name}→
                To:{" "}
                {
                  selectedBooking.flightId?.segments[
                    selectedBooking.flightId?.segments.length - 1
                  ].arrivalAirport.name
                }
              </p>
              <p>
                Departure:{" "}
                {new Date(
                  selectedBooking.flightId?.segments[0].departureTime
                ).toLocaleString()}
                → Arrival:{" "}
                {new Date(
                  selectedBooking.flightId?.segments[
                    selectedBooking.flightId?.segments.length - 1
                  ].arrivalTime
                ).toLocaleString()}
              </p>

              <h3 className="font-medium text-lg mt-4">Passenger Details</h3>
              <ul>
                {selectedBooking.passengers.map((passenger, index) => (
                  <li key={index}>
                    <strong>{passenger.fullName}</strong> (
                    {passenger.passengerType})
                    <div>Email: {passenger.email}</div>
                    <div>Gender: {passenger.gender}</div>
                    <div>Nationality: {passenger.nationality}</div>
                  </li>
                ))}
              </ul>

              <h3 className="font-medium text-lg mt-4">Booking Status</h3>
              <p>{selectedBooking.bookingStatus}</p>
            </div>
          </div>
        )}
      </Popup>
    </AdminLayout>
  );
};

export default Bookings;
