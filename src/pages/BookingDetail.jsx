import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Plane,
  Calendar,
  Users,
  Phone,
  Mail,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BookingDetail = () => {
  const { id } = useParams();
  const bookings = useSelector((state) => state.bookings.bookings);
  const booking = bookings.find((b) => b._id === id);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-6 h-6" />
          <span className="text-lg">Booking not found.</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Booking Details</h2>
            {/* <p className="text-blue-100">Booking ID: {booking._id}</p> */}
          </div>

          {/* Flight Info Section */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4 mb-6">
              <Plane className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {booking.flightId.segments[0]?.departureAirport?.name ||
                        "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Departure</p>
                  </div>
                  <div className="flex-1 px-8">
                    <div className="h-0.5 bg-blue-600 relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Plane className="w-4 h-4 text-blue-600 rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {booking.flightId.segments[
                        booking.flightId.segments.length - 1
                      ]?.arrivalAirport?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Arrival</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Flight Number</p>
                <p className="font-semibold">
                  {booking.flightId.segments[0]?.flightNumber || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Travel Class</p>
                <p className="font-semibold">{booking.travelClass}</p>
              </div>
            </div>
          </div>

          {/* Passengers Section */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Passengers</h3>
            </div>
            <div className="space-y-2">
              {booking.passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <span className="font-medium">{passenger.fullName}</span>
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {passenger.passengerType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Payment Section */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{booking.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{booking.contactInfo.phoneNumber}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  Payment Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">
                      INR {booking.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booking Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        booking.bookingStatus
                      )}`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingDetail;
