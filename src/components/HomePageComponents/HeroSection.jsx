import { useState } from "react";
import { MapPin, Calendar, Search, Plus, Minus } from "lucide-react";

const HeroSection = () => {
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [tripType, setTripType] = useState("oneWay");

  const updatePassengers = (type, operation) => {
    setPassengers((prev) => ({
      ...prev,
      [type]:
        operation === "add"
          ? prev[type] + 1
          : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  placeholder="From"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  placeholder="To"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  type="date"
                  placeholder="Departure"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
                  type="date"
                  placeholder="Return"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <select className="pl-3 pr-8 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500">
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
                    checked={tripType === "oneWay"}
                    onChange={() => setTripType("oneWay")}
                  />
                  <span className="ml-2">One Way</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-500"
                    name="tripType"
                    value="roundTrip"
                    checked={tripType === "roundTrip"}
                    onChange={() => setTripType("roundTrip")}
                  />
                  <span className="ml-2">Round Trip</span>
                </label>
              </div>
            </div>
            <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center">
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
