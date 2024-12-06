import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plane, Users, Phone, CreditCard, PlaneTakeoff } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosInstance from "../config/axiosInstance";
import SeatMap from "../components/SeatMap";

const Itinerary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const flightId = searchParams.get("flightId");
  const adults = Number(searchParams.get("adults"));
  const children = Number(searchParams.get("children"));
  const travelClass = searchParams.get("travelClass");

  const [currentStep, setCurrentStep] = useState(1);
  const [flightDetails, setFlightDetails] = useState(null);
  const [bookedSeats, setBookedSeats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [passengerDetails, setPassengerDetails] = useState(
    Array(adults + children)
      .fill({
        fullName: "",
        gender: "",
        nationality: "",
        dateOfBirth: "",
        passportNumber: "",
        isChild: false,
      })
      .map((passenger, index) => ({
        ...passenger,
        isChild: index >= adults,
      }))
  );
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phoneNumber: "",
  });
  // const [clientSecret, setClientSecret] = useState("");
  // const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axiosInstance.get(`/flight/${flightId}`);
        setFlightDetails(response.data.response.flightDetails);
        setBookedSeats(response.data.response.bookedSeats);
      } catch (err) {
        setError("Failed to fetch flight details");
      } finally {
        setLoading(false);
      }
    };

    if (flightId) {
      fetchFlightDetails();
    }
  }, [flightId]);

  // useEffect(() => {
  //   const fetchPassengerDetails = async () => {
  //     try {
  //       const response = await axiosInstance.get("/other-travellers");
  //       console.log(response);
  //       setPassengerDetails(response.data.response);
  //     } catch (error) {
  //       console.error("Error fetching passengers", error);
  //     }
  //   };
  //   fetchPassengerDetails();
  // }, []);

  const steps = [
    { number: 1, title: "Review Itinerary", icon: Plane },
    { number: 2, title: "Select Seats (Optional)", icon: Users },
    { number: 3, title: "Passenger Details", icon: Users },
    { number: 4, title: "Contact Information", icon: Phone },
  ];
  console.log(flightDetails);

  const renderStepIndicator = () => (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex flex-col items-center ${
                index < steps.length - 1 ? "w-full" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span
                className={`mt-2 text-sm ${
                  currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFlightReview = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-6xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600">
        Flight Details
      </h3>
      {flightDetails && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-6 border-b">
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {flightDetails.airline.airlineName}
              </p>
              <p className="text-gray-600">
                Flight {flightDetails.segments[0].flightNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-500">
                INR {flightDetails.ticketPrices[travelClass.toLowerCase()]}
              </p>
              <p className="text-gray-600">Class: {travelClass}</p>
            </div>
          </div>

          {flightDetails.segments.map((segment, index) => (
            <div key={segment._id} className="space-y-4">
              <h4 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-300 pb-2 mb-4 flex items-center">
                {segment.departureAirport.code}
                <PlaneTakeoff className="mx-2 text-blue-600" size={20} />
                {segment.arrivalAirport.code}
              </h4>
              <div className="grid grid-cols-2 gap-6 border-b pb-4">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-800">
                    Departure
                  </p>
                  <p className="text-gray-700">
                    {formatTime(segment.departureTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(segment.departureTime)}
                  </p>
                  <p className="text-gray-600">
                    {segment.departureAirport.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {segment.departureTerminal}, Gate {segment.departureGate}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-800">Arrival</p>
                  <p className="text-gray-700">
                    {formatTime(segment.arrivalTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(segment.arrivalTime)}
                  </p>
                  <p className="text-gray-600">{segment.arrivalAirport.name}</p>
                  <p className="text-sm text-gray-500">
                    {segment.arrivalTerminal}, Gate {segment.arrivalGate}
                  </p>
                </div>
              </div>

              {/* Display layover info if not a direct flight */}
              {index < flightDetails.segments.length - 1 &&
                !flightDetails.isDirect && (
                  <div className="bg-yellow-100 p-4 rounded-lg mt-4">
                    <p className="text-md font-semibold text-yellow-800">
                      Layover at{" "}
                      {flightDetails.segments[index + 1].departureAirport.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration:{" "}
                      {calculateLayoverDuration(
                        segment,
                        flightDetails.segments[index + 1]
                      )}
                    </p>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Function to calculate layover duration
  const calculateLayoverDuration = (currentSegment, nextSegment) => {
    const arrival = new Date(currentSegment.arrivalTime);
    const nextDeparture = new Date(nextSegment.departureTime);
    const diffInMs = nextDeparture - arrival;

    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const renderSeatSelection = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">
        Select Your Seats (Optional)
      </h3>
      <p className="text-gray-600 mb-4">
        Choose your preferred seats or skip this step. Window and aisle seats
        may have additional charges.
      </p>

      <SeatMap
        flightDetails={flightDetails}
        travelClass={travelClass}
        selectedSeats={selectedSeats}
        bookedSeats={bookedSeats}
        onSeatSelect={(seatNumber, segmentIndex) => {
          console.log(seatNumber, segmentIndex);
          setSelectedSeats((prevSelectedSeats) => {
            const segmentSeats = prevSelectedSeats[segmentIndex] || [];
            if (segmentSeats.includes(seatNumber)) {
              return {
                ...prevSelectedSeats,
                [segmentIndex]: segmentSeats.filter(
                  (seat) => seat !== seatNumber
                ),
              };
            } else {
              if (segmentSeats.length < adults + children) {
                return {
                  ...prevSelectedSeats,
                  [segmentIndex]: [...segmentSeats, seatNumber],
                };
              } else {
                alert(
                  `You can only select ${
                    adults + children
                  } seats for each flight`
                );
                return prevSelectedSeats;
              }
            }
          });
        }}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Skip Seat Selection
        </button>
        {/* <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          Confirm Seats
        </button> */}
      </div>
    </div>
  );

  const renderPassengerDetails = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Passenger Details</h3>
      {passengerDetails.map((passenger, index) => (
        <div key={index} className="mb-6 border-b pb-6 last:border-b-0">
          <h4 className="font-semibold mb-4">
            Passenger {index + 1} {passenger.isChild ? "(Child)" : "(Adult)"}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passenger.fullName}
                onChange={(e) => {
                  const newPassengers = [...passengerDetails];
                  newPassengers[index] = {
                    ...passenger,
                    fullName: e.target.value,
                  };
                  setPassengerDetails(newPassengers);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passenger.gender}
                onChange={(e) => {
                  const newPassengers = [...passengerDetails];
                  newPassengers[index] = {
                    ...passenger,
                    gender: e.target.value,
                  };
                  setPassengerDetails(newPassengers);
                }}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passenger.nationality}
                onChange={(e) => {
                  const newPassengers = [...passengerDetails];
                  newPassengers[index] = {
                    ...passenger,
                    nationality: e.target.value,
                  };
                  setPassengerDetails(newPassengers);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passenger.dateOfBirth}
                onChange={(e) => {
                  const newPassengers = [...passengerDetails];
                  newPassengers[index] = {
                    ...passenger,
                    dateOfBirth: e.target.value,
                  };
                  setPassengerDetails(newPassengers);
                }}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Number
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={passenger.passportNumber}
                onChange={(e) => {
                  const newPassengers = [...passengerDetails];
                  newPassengers[index] = {
                    ...passenger,
                    passportNumber: e.target.value,
                  };
                  setPassengerDetails(newPassengers);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContactInformation = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={contactInfo.email}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, email: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={contactInfo.phoneNumber}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, phoneNumber: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPriceBreakdown = () => (
    <div className="bg-white rounded-lg shadow p-6 sticky top-32">
      <h3 className="text-xl font-semibold mb-4">Price Breakdown</h3>
      {flightDetails && (
        <div className="space-y-4">
          {/* Price Based on Class */}
          <div className="flex justify-between items-center pb-3">
            <span className="text-gray-600">Economy Class</span>
            <span>
              ₹
              {flightDetails.ticketPrices[travelClass.toLowerCase()].toFixed(2)}
            </span>
          </div>

          {/* Taxes & Fees */}
          <div className="flex justify-between items-center pb-3">
            <span className="text-gray-600">Taxes & Fees</span>
            <span>
              ₹
              {(
                flightDetails.ticketPrices[travelClass.toLowerCase()] *
                (adults + children) *
                0.1
              ).toFixed(2)}
            </span>
          </div>

          {/* Seat Selection */}
          {Object.keys(selectedSeats).some(
            (key) => selectedSeats[key].length > 0
          ) && (
            <div className="flex justify-between items-center pb-3">
              <span className="text-gray-600">Seat Selection Cost</span>
              <span>₹ {calculateSeatSelectionCost().toFixed(2)}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>
                Total Amount ({adults} Adult{adults > 1 ? "s" : ""}, {children}{" "}
                Child{children > 1 ? "ren" : ""})
              </span>
              <span className="text-blue-600 font-bold">
                INR {calculateTotalPrice()}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-sm text-gray-500">
            <p>* Child fare is 80% of adult fare</p>
            <p>* Taxes & fees include 10% of total fare</p>
            <p>* Seat selection costs $10 per seat</p>
          </div>
        </div>
      )}
    </div>
  );

  const calculateSeatSelectionCost = () => {
    let totalSeatCost = 0;

    flightDetails.segments.forEach((segment, segmentIndex) => {
      const seatingDetails = segment.aircraft.seatingDetails.find(
        (detail) => detail.class.toLowerCase() === travelClass.toLowerCase()
      );

      if (!seatingDetails) {
        console.error(`No seating details found for class: ${travelClass}`);
        return;
      }

      const segmentSeats = selectedSeats[segmentIndex] || [];
      segmentSeats.forEach((seat) => {
        const seatDetails = seatingDetails.seats.find(
          (s) => s.seatNumber === seat
        );
        if (seatDetails) {
          switch (seatDetails.type) {
            case "WINDOW":
              totalSeatCost += seatingDetails.windowPrice;
              break;
            case "AISLE":
              totalSeatCost += seatingDetails.aislePrice;
              break;
            case "MIDDLE":
              totalSeatCost += seatingDetails.middlePrice;
              break;
            default:
              break;
          }
        }
      });
    });
    return totalSeatCost;
  };

  const calculateTotalPrice = () => {
    const basePrice =
      flightDetails.ticketPrices[travelClass.toLowerCase()] *
      (adults + children);
    const TaxesAndFares =
      flightDetails.ticketPrices[travelClass.toLowerCase()] *
      (adults + children) *
      0.1;
    const seatPrice = calculateSeatSelectionCost();
    return (basePrice + TaxesAndFares + seatPrice).toFixed(2);
  };

  const handleContinueToCheckout = () => {
    const totalPrice = calculateTotalPrice();
    navigate("/checkout", {
      state: {
        totalPrice,
        flightDetails,
        selectedSeats,
        passengerDetails,
        contactInfo,
        travelClass,
      },
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderFlightReview();
      case 2:
        return renderSeatSelection();
      case 3:
        return renderPassengerDetails();
      case 4:
        return renderContactInformation();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-8xl px-4 py-8 mt-28">
        {renderStepIndicator()}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderCurrentStep()}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Back
                </button>
              )}
              {currentStep < steps.length && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors ml-auto"
                >
                  Continue
                </button>
              )}
              {currentStep === steps.length && (
                <button
                  onClick={handleContinueToCheckout}
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors ml-auto flex items-center space-x-2"
                >
                  <span>Continue to Checkout</span>
                  <CreditCard className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div>{renderPriceBreakdown()}</div>
        </div>
        {/* {paymentProcessing && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )} */}
      </main>
      <Footer />
    </div>
  );
};

export default Itinerary;
