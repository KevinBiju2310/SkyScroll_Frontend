import { Plane, Loader } from "lucide-react";
import Header from "../components/Header";
import FlightSearchForm from "../components/TripListingComponents/FlightSearchForm";
import OneWayFlight from "../components/TripListingComponents/OneWayFlight";
import RoundTripFlight from "../components/TripListingComponents/RoundTripFlight";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";
import Footer from "../components/Footer";

const TripsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState({
    outboundFlights: [],
    returnFlights: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFlights, setSelectedFlights] = useState([]);

  const getSearchDetails = () => ({
    fromAirport: searchParams.get("from"),
    toAirport: searchParams.get("to"),
    departureDate: searchParams.get("departureDate"),
    returnDate: searchParams.get("returnDate"),
    tripType: searchParams.get("tripType"),
    travelClass: searchParams.get("travelClass"),
    adults: searchParams.get("adults"),
    children: searchParams.get("children"),
  });

  const passengerCount =
    Number(searchParams.get("adults")) + Number(searchParams.get("children"));
  const tripType = searchParams.get("tripType");
  const travelClass = searchParams.get("travelClass");
  const adults = Number(searchParams.get("adults")) || 1;
  const children = Number(searchParams.get("children")) || 0;

  useEffect(() => {
    const searchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchDetails = getSearchDetails();
        const response = await axiosInstance.get("/search-flight", {
          params: searchDetails,
        });
        console.log(response);
        if (tripType === "roundTrip") {
          // Assuming response contains separate arrays for outbound and return flights
          setFlights({
            outboundFlights: response.data.response.outboundFlights || [],
            returnFlights: response.data.response.returnFlights || [],
          });
        } else {
          setFlights({
            outboundFlights: response.data.response.outboundFlights || [],
            returnFlights: [],
          });
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
        setError("Failed to fetch flights. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (
      searchParams.get("from") &&
      searchParams.get("to") &&
      searchParams.get("departureDate")
    ) {
      searchFlights();
    }
  }, [searchParams, tripType]);

  const initialSearchParams = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    departureDate: searchParams.get("departureDate") || "",
    returnDate: searchParams.get("returnDate") || "",
    tripType: searchParams.get("tripType") || "roundTrip",
    travelClass: searchParams.get("travelClass"),
    adults: Number(searchParams.get("adults")) || 1,
    children: Number(searchParams.get("children")) || 0,
  };

  // Handle selecting a flight or round trip
  const handleSelectFlight = (flight) => {
    if (Array.isArray(flight)) {
      const [outboundFlight, returnFlight] = flight;
      navigate(
        `/itinerary?outboundFlightId=${outboundFlight._id}&returnFlightId=${returnFlight._id}&adults=${adults}&children=${children}&travelClass=${travelClass}`
      );
    } else {
      navigate(
        `/itinerary?flightId=${flight._id}&adults=${adults}&children=${children}&travelClass=${travelClass}`
      );
    }
  };

  const handleSearch = (newSearchParams) => {
    setSearchParams(newSearchParams);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow">
        <div
          className="relative w-full py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://c4.wallpaperflare.com/wallpaper/423/753/73/world-map-time-zones-wallpaper-preview.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-6">
              Find Your Perfect Flight
            </h1>
            <FlightSearchForm
              initialParams={initialSearchParams}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-xl font-semibold">{error}</p>
            </div>
          ) : tripType === "roundTrip" ? (
            // Render RoundTripFlight component
            flights.outboundFlights.length > 0 &&
            flights.returnFlights.length > 0 ? (
              flights.outboundFlights.map((outboundFlight) =>
                flights.returnFlights.map((returnFlight) => (
                  <RoundTripFlight
                    key={`${outboundFlight._id}-${returnFlight._id}`}
                    outboundFlight={outboundFlight}
                    returnFlight={returnFlight}
                    passengerCount={passengerCount}
                    travelClass={travelClass}
                    onSelectFlight={handleSelectFlight}
                  />
                ))
              )
            ) : (
              <div className="text-center py-20">
                <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Round Trip Flights Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria to find available flights.
                </p>
              </div>
            )
          ) : flights.outboundFlights.length > 0 ? (
            // Render OneWayFlight component
            flights.outboundFlights.map((flight) => (
              <OneWayFlight
                key={flight._id}
                flight={flight}
                passengerCount={passengerCount}
                tripType={tripType}
                travelClass={travelClass}
                onSelectFlight={handleSelectFlight}
              />
            ))
          ) : (
            <div className="text-center py-20">
              <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Flights Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria to find available flights.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripsListing;
