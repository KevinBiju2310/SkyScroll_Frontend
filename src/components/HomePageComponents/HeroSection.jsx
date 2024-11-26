import { useEffect, useState, useRef } from "react";
import { MapPin, Calendar, Search, Plus, Minus } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [airports, setAirports] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [filteredFromAirports, setFilteredFromAirports] = useState([]);
  const [filteredToAirports, setFilteredToAirports] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState({
    fromAirport: "",
    toAirport: "",
    departureDate: "",
    returnDate: "",
    tripType: "oneWay",
    travelClass: "Economy",
  });

  const updatePassengers = (type, operation) => {
    setPassengers((prev) => ({
      ...prev,
      [type]:
        operation === "add"
          ? prev[type] + 1
          : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
  };

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axiosInstance.get("/airports");
        setAirports(response.data.response);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    fetchAirports();

    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTripDetailsChange = (field, value) => {
    setTripDetails((prev) => ({ ...prev, [field]: value }));
    setShowErrors(false);

    if (field === "fromAirport") {
      const filtered = airports
        .filter(
          (airport) =>
            airport.name.toLowerCase().includes(value.toLowerCase()) ||
            airport.code.toLowerCase().includes(value.toLowerCase()) ||
            airport.city.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setFilteredFromAirports(filtered);
      setShowFromSuggestions(true);
    } else if (field === "toAirport") {
      const filtered = airports
        .filter(
          (airport) =>
            airport.name.toLowerCase().includes(value.toLowerCase()) ||
            airport.code.toLowerCase().includes(value.toLowerCase()) ||
            airport.city.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setFilteredToAirports(filtered);
      setShowToSuggestions(true);
    }
  };

  const handleAirportSelect = (airport, field) => {
    setTripDetails((prev) => ({
      ...prev,
      [field]: `${airport.name}`,
    }));
    if (field === "fromAirport") {
      setShowFromSuggestions(false);
    } else {
      setShowToSuggestions(false);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if departure and arrival airports are filled
    if (!tripDetails.fromAirport.trim()) {
      newErrors.push("Please select a departure airport");
    }

    if (!tripDetails.toAirport.trim()) {
      newErrors.push("Please select an arrival airport");
    }

    // Check if departure and arrival airports are different
    if (
      tripDetails.fromAirport.trim() &&
      tripDetails.toAirport.trim() &&
      tripDetails.fromAirport.toLowerCase() ===
        tripDetails.toAirport.toLowerCase()
    ) {
      newErrors.push("Departure and arrival airports cannot be the same");
    }

    // Check if departure date is selected
    if (!tripDetails.departureDate) {
      newErrors.push("Please select a departure date");
    } else {
      const departureDate = new Date(tripDetails.departureDate);
      if (departureDate < today) {
        newErrors.push("Departure date cannot be in the past");
      }
    }

    // Check return date for round trips
    if (tripDetails.tripType === "roundTrip") {
      if (!tripDetails.returnDate) {
        newErrors.push("Please select a return date for round trip");
      } else {
        const departureDate = new Date(tripDetails.departureDate);
        const returnDate = new Date(tripDetails.returnDate);
        if (returnDate < departureDate) {
          newErrors.push("Return date cannot be before departure date");
        }
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSearch = () => {
    if (validateForm()) {
      const params = new URLSearchParams({
        from: tripDetails.fromAirport,
        to: tripDetails.toAirport,
        departureDate: tripDetails.departureDate,
        returnDate: tripDetails.returnDate,
        travelClass: tripDetails.travelClass,
        tripType: tripDetails.tripType,
        adults: passengers.adults.toString(),
        children: passengers.children.toString(),
      });

      navigate(`/search-trip?${params.toString()}`);
    } else {
      setShowErrors(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/043/191/558/non_2x/airplane-side-view-flying-above-the-clouds-with-dramatic-sky-background-illustration-plane-with-sunset-concept-vector.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex justify-end w-full mr-20">
        <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden relative z-10">
          <div className="p-5 bg-gradient-to-r from-sky-400 to-blue-500">
            <h1 className="text-4xl font-bold text-white mb-2">
              Discover Your Dream Destination
            </h1>
            <p className="text-blue-100">
              Find the best flights for your next adventure
            </p>
          </div>
          <div className="p-8">
            {showErrors && errors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                {errors.map((error, index) => (
                  <div key={index} className="text-red-600 mb-1">
                    • {error}
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative" ref={fromRef}>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  placeholder="From"
                  value={tripDetails.fromAirport}
                  onChange={(e) =>
                    handleTripDetailsChange("fromAirport", e.target.value)
                  }
                />
                {showFromSuggestions && filteredFromAirports.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {filteredFromAirports.map((airport, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleAirportSelect(airport, "fromAirport")
                        }
                      >
                        <div className="font-semibold">
                          {airport.city} ({airport.code})
                        </div>
                        <div className="text-sm text-gray-600">
                          {airport.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={toRef}>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  placeholder="To"
                  value={tripDetails.toAirport}
                  onChange={(e) =>
                    handleTripDetailsChange("toAirport", e.target.value)
                  }
                />
                {showToSuggestions && filteredToAirports.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {filteredToAirports.map((airport, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleAirportSelect(airport, "toAirport")
                        }
                      >
                        <div className="font-semibold">
                          {airport.city} ({airport.code})
                        </div>
                        <div className="text-sm text-gray-600">
                          {airport.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  type="date"
                  placeholder="Departure"
                  value={tripDetails.departureDate}
                  onChange={(e) =>
                    handleTripDetailsChange("departureDate", e.target.value)
                  }
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  type="date"
                  placeholder="Return"
                  value={tripDetails.returnDate}
                  onChange={(e) =>
                    handleTripDetailsChange("returnDate", e.target.value)
                  }
                  disabled={tripDetails.tripType === "oneWay"}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <select
                  className="pl-3 pr-8 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  value={tripDetails.travelClass}
                  onChange={(e) =>
                    handleTripDetailsChange("travelClass", e.target.value)
                  }
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => updatePassengers("adults", "subtract")}
                      className="p-1 bg-gray-200 rounded-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-2 font-semibold">
                      {passengers.adults} Adults
                    </span>
                    <button
                      onClick={() => updatePassengers("adults", "add")}
                      className="p-1 bg-gray-200 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updatePassengers("children", "subtract")}
                      className="p-1 bg-gray-200 rounded-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-2 font-semibold">
                      {passengers.children} Children
                    </span>
                    <button
                      onClick={() => updatePassengers("children", "add")}
                      className="p-1 bg-gray-200 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-500"
                    name="tripType"
                    value="oneWay"
                    checked={tripDetails.tripType === "oneWay"}
                    onChange={() =>
                      handleTripDetailsChange("tripType", "oneWay")
                    }
                  />
                  <span className="ml-2">One Way</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-500"
                    name="tripType"
                    value="roundTrip"
                    checked={tripDetails.tripType === "roundTrip"}
                    onChange={() =>
                      handleTripDetailsChange("tripType", "roundTrip")
                    }
                  />
                  <span className="ml-2">Round Trip</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            >
              <Search size={20} className="mr-2" />
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
