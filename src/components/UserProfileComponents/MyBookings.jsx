import { Plane, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/axiosInstance";
import { setBookings } from "../../redux/bookingSlice";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookings = useSelector((state) => state.bookings.bookings);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get("/bookings");
        dispatch(setBookings(response.data.response));
      } catch (error) {
        console.error("Error Occurred", error);
      }
    };

    fetchBookingDetails();
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mt-24">
        <h2 className="text-2xl font-bold">My Bookings</h2>
      </div>
      <p className="text-1xl mb-4 text-gray-700">View all bookings and manage</p>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        bookings.map((booking) => {
          const departureAirport =
            booking?.flightId?.segments?.[0]?.departureAirport?.name || "N/A";
          const arrivalAirport =
            booking?.flightId?.segments?.[
              booking.flightId?.segments?.length - 1
            ]?.arrivalAirport?.name || "N/A";

          return (
            <div
              key={booking._id}
              className="border rounded-lg p-4 mb-4 flex items-center justify-between bg-blue-50"
            >
              <div className="flex items-center space-x-4">
                <Plane className="text-blue-500" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{departureAirport}</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{arrivalAirport}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>{" "}
                    • <span>{booking.travelClass}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {booking.paymentStatus === "SUCCESS" ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-800" />
                    <span className="text-sm font-bold text-green-600">
                      Payment Successful
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-800" />
                    <span className="text-sm font-bold text-red-600">
                      Payment {booking.paymentStatus}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => navigate(`/booking-detail/${booking._id}`)}
                className="text-blue-800 hover:underline"
              >
                View Booking
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};


export default MyBookings;
