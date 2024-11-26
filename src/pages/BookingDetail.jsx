import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  Plane,
  Calendar,
  Send,
  Download,
  Users,
  Phone,
  Mail,
  CreditCard,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatSidebar from "../components/ChatSidebar";
import ticketGenerator from "../utils/ticketGenerator";
import ConfirmationModal from "../components/ConfirmationModal";
import axiosInstance from "../config/axiosInstance";
import { updateBookingStatus } from "../redux/bookingSlice";

const BookingDetail = () => {
  const { id } = useParams();
  const bookings = useSelector((state) => state.bookings.bookings);
  const booking = bookings.find((b) => b._id === id);

  const dispatch = useDispatch();

  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDownloadTicket = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const doc = await ticketGenerator(booking);
      const ticketName = `ticket.pdf`;
      doc.save(ticketName);
    } catch (error) {
      console.error("Error generating Ticket:", error);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 800);
    }
  };

  const handleCancelBooking = () => {
    setIsModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/cancelbooking/${id}`);
      dispatch(updateBookingStatus(response.data.response)); // Update Redux store
      // console.log("Booking cancelled:", response.data.response);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };
  // Open chat sidebar
  const openChatSidebar = () => {
    setSelectedAirline({
      airlineName: booking.flightId.airline?.airlineName || "Airline Support",
      profilepic: booking.flightId.airline?.profilepic || "",
    });
    setIsChatSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isChatSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsChatSidebarOpen(false)}
        />
      )}
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-8 text-white flex justify-between items-center">
            <h2 className="text-3xl font-bold mb-2">Booking Details</h2>
            <button
              onClick={handleDownloadTicket}
              disabled={isDownloading}
              className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <Download
                className={`w-5 h-5 ${isDownloading ? "animate-spin" : ""}`}
              />
              <span>{isDownloading ? "Generating..." : "Download Ticket"}</span>
            </button>
          </div>

          {/* Flight Info Section */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4 mb-6">
              <Plane className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {booking.flightId.segments?.[0]?.departureAirport?.name ||
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
                      {booking.flightId.segments?.[
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
                  {booking.flightId.segments?.[0]?.flightNumber || "N/A"}
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

          {/* Chat Support Section */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              {/* Chat Support */}
              <div className="flex items-center space-x-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Need Help?</h3>
                <button
                  onClick={openChatSidebar}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  <span>Start Chat Support</span>
                </button>
              </div>

              {/* Cancel Booking Button */}
              <button
                onClick={handleCancelBooking}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading || booking.bookingStatus === "CANCELLED"}
              >
                <span>{loading ? "Processing..." : "Cancel Booking"}</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Our support team is ready to assist you with any questions about
              your booking.
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <ChatSidebar
        selectedAirline={selectedAirline}
        isSidebarOpen={isChatSidebarOpen}
        closeSidebar={() => setIsChatSidebarOpen(false)}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmCancelBooking}
        onCancel={cancelModal}
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />
    </div>
  );
};

export default BookingDetail;
