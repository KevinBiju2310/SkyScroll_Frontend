import { useState, useEffect } from "react";
import { Calendar, Search, RefreshCcw, Eye } from "lucide-react";
import AirlineLayout from "../../components/AirlineSidebar";
import axiosInstance from "../../config/axiosInstance";
import Popup from "../../components/PopUp";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/airline/bookings");
      console.log(response);
      setBookings(response.data.response);
    } catch (error) {
      console.error("Error Occurred", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.passengers[0]?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.flightId?.segments[0]?.flightNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBooking(null);
  };

  const handleChangeBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/airline/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      console.log(response)
      if (response.status === 201) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, bookingStatus: newStatus }
              : booking
          )
        );
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: newStatus }));
      }
    } catch (error) {
      console.error("Failed to update booking status", error);
    }
  };
  

  const getStatusStyle = (status) => {
    const styles = {
      CONFIRMED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
      SUCCESS: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <AirlineLayout>
      <div className="p-8 max-w-8xl">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Flight Bookings
              </h1>
              <button
                onClick={fetchBookings}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by passenger name or flight number..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-500">
                  No bookings found for this airline.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      {[
                        "Passenger",
                        "Flight Number",
                        "Travel Class",
                        "Booking Date",
                        "Booking Status",
                        "Payment Status",
                        "Total Passengers",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.passengers[0]?.fullName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.flightId?.segments[0]?.flightNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.travelClass}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                              booking.bookingStatus
                            )}`}
                          >
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.paymentStatus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.passengers.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Eye className="mr-1" size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup for Booking Details */}
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        {selectedBooking && (
          <div>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>

            {/* Flight Details */}
            <h3 className="text-lg font-bold mt-4">Flight Details</h3>
            {selectedBooking.flightId?.segments.map((segment, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>Flight Number:</strong>{" "}
                  {segment.flightNumber || "N/A"}
                </p>
                <p>
                  <strong>From:</strong>{" "}
                  {segment.departureAirport.name || "N/A"}
                </p>
                <p>
                  <strong>To:</strong> {segment.arrivalAirport.name || "N/A"}
                </p>
                <p>
                  <strong>Depature Date:</strong>{" "}
                  {new Date(segment.departureTime).toLocaleDateString() ||
                    "N/A"}
                </p>
                <p>
                  <strong>Arrival Date:</strong>{" "}
                  {new Date(segment.arrivalTime).toLocaleDateString() || "N/A"}
                </p>
              </div>
            ))}

            {/* Booking Status Dropdown */}
            <div className="mt-4">
              <h3 className="text-lg font-bold">Booking Status</h3>
              <select
                value={selectedBooking.bookingStatus}
                onChange={(e) =>
                  handleChangeBookingStatus(selectedBooking._id, e.target.value)
                }
                className="block w-full mt-2 p-2 border border-gray-300 rounded-md"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            {/* Passenger Details */}
            <h3 className="text-lg font-bold mt-4">Passenger Details</h3>
            <ul>
              {selectedBooking.passengers.map((passenger, index) => (
                <li key={index} className="mb-1">
                  <strong>{passenger.fullName}</strong> (
                  {passenger.passengerType || "N/A"})<p>{passenger.gender}</p>
                  <p>{passenger.nationality}</p>
                  <p>{passenger.passportNumber}</p>
                </li>
              ))}
            </ul>

            {/* Contact Details */}
            <h3 className="text-lg font-bold mt-4">Contact Details</h3>
            <p>
              <strong>Email:</strong>{" "}
              {selectedBooking.contactInfo?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {selectedBooking.contactInfo?.phoneNumber || "N/A"}
            </p>
          </div>
        )}
      </Popup>
    </AirlineLayout>
  );
};

export default Bookings;
