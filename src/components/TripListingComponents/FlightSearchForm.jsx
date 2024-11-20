import { useState } from "react";
import { Plane, Calendar, Users, ChevronDown } from "lucide-react";

const FlightSearchForm = () => {
  const [tripType, setTripType] = useState("roundTrip");
  const [travelClass, setTravelClass] = useState("economy");
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-wrap items-center gap-6">
        {/* Trip Type Radio Buttons */}
        <div className="flex items-center gap-6 border-r pr-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="roundTrip"
              checked={tripType === "roundTrip"}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">Round Trip</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="oneWay"
              checked={tripType === "oneWay"}
              onChange={(e) => setTripType(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">One Way</span>
          </label>
        </div>

        {/* From Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Plane className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="From"
            className="w-44 pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* To Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Plane className="h-4 w-4 text-gray-400 transform rotate-90" />
          </div>
          <input
            type="text"
            placeholder="To"
            className="w-44 pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Departure Date */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="date"
            className="w-44 pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Return Date */}
        {tripType === "roundTrip" && (
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              className="w-44 pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Travel Class & Passengers */}
        <div className="relative">
          <button
            onClick={() => setShowClassDropdown(!showClassDropdown)}
            className="flex items-center justify-between px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 w-56"
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-700">
                {passengers.adults + passengers.children} Passenger(s),{" "}
                {travelClass}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
          </button>

          {showClassDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 w-56">
              <div className="space-y-3">
                {/* Class Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Travel Class
                  </label>
                  <select
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>

                {/* Passengers */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Adults
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setPassengers((prev) => ({
                          ...prev,
                          adults: Math.max(1, prev.adults - 1),
                        }))
                      }
                      className="p-1 border rounded-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm">{passengers.adults}</span>
                    <button
                      onClick={() =>
                        setPassengers((prev) => ({
                          ...prev,
                          adults: prev.adults + 1,
                        }))
                      }
                      className="p-1 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Children
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setPassengers((prev) => ({
                          ...prev,
                          children: Math.max(0, prev.children - 1),
                        }))
                      }
                      className="p-1 border rounded-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm">{passengers.children}</span>
                    <button
                      onClick={() =>
                        setPassengers((prev) => ({
                          ...prev,
                          children: prev.children + 1,
                        }))
                      }
                      className="p-1 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button className="px-8 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
