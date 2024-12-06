/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Plane,
  Clock,
  ChevronDown,
  ChevronUp,
  Building2,
  DoorOpen,
} from "lucide-react";

const OneWayFlight = ({
  flight,
  passengerCount,
  travelClass,
  onSelectFlight,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (time, timeZone) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }).format(new Date(time));

  const formatDate = (date, timeZone) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone,
    }).format(new Date(date));

  const calculateDuration = (departure, arrival) => {
    const duration = (new Date(arrival) - new Date(departure)) / (1000 * 60);
    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };

  const calculatePrice = () => {
    return flight.ticketPrices[travelClass.toLowerCase()];
  };

  const getStopsText = (segments) => {
    const numStops = segments.length - 1;
    if (numStops === 0) return "Non-stop";
    return `${numStops} ${numStops === 1 ? "stop" : "stops"}`;
  };

  const getTotalDuration = (segments) => {
    const firstDeparture = segments[0].departureTime;
    const lastArrival = segments[segments.length - 1].arrivalTime;
    return calculateDuration(firstDeparture, lastArrival);
  };
  console.log(flight);
  return (
    <div className="w-full max-w-4xl bg-white border rounded-xl hover:shadow-lg transition-all duration-300 m-4">
      <div className="p-5">
        {/* Main Flight Info Container */}
        <div className="flex items-center justify-between">
          {/* Left Section: Airline and Flight Details */}
          <div className="flex items-center gap-8">
            {/* Airline Info */}
            <div className="flex items-center gap-3 min-w-[140px]">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <img
                  src={flight.airline.profilepic}
                  alt="Airline"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {flight.airline.airlineName}
                </p>
                <p className="text-xs text-gray-500">
                  #{flight.segments[0].flightNumber}
                </p>
              </div>
            </div>

            {/* Flight Times and Route */}
            <div className="flex items-center gap-6">
              {/* Departure */}
              <div className="text-center min-w-[100px]">
                <p className="text-xl font-semibold text-gray-800">
                  {formatTime(
                    flight.segments[0].departureTime,
                    flight.segments[0].departureAirport.timeZone
                  )}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {flight.segments[0].departureAirport.code}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(
                    flight.segments[0].departureTime,
                    flight.segments[0].departureAirport.timeZone
                  )}
                </p>
              </div>

              {/* Flight Duration */}
              <div className="flex flex-col items-center gap-1 min-w-[150px]">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-[2px] bg-gray-300"></div>
                  <Plane className="w-5 h-5 text-blue-500" />
                  <div className="w-16 h-[2px] bg-gray-300"></div>
                </div>
                <p className="text-xs text-gray-500">
                  {flight.segments[0].duration}
                </p>
                <p className="text-xs text-blue-600">
                  {getStopsText(flight.segments)}
                </p>
              </div>

              {/* Arrival */}
              <div className="text-center min-w-[100px]">
                <p className="text-xl font-semibold text-gray-800">
                  {formatTime(
                    flight.segments[flight.segments.length - 1].arrivalTime,
                    flight.segments[flight.segments.length - 1].arrivalAirport
                      .timezone
                  )}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {
                    flight.segments[flight.segments.length - 1].arrivalAirport
                      .code
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(
                    flight.segments[flight.segments.length - 1].arrivalTime,
                    flight.segments[flight.segments.length - 1].arrivalAirport
                      .timezone
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Price and Booking */}
          <div className="flex items-center gap-6">
            {/* Price Information */}
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                INR {calculatePrice()}
              </p>
              <p className="text-sm text-gray-500">
                {passengerCount} passenger{passengerCount > 1 ? "s" : ""}
              </p>
            </div>

            {/* Book Button */}
            <button
              onClick={() => onSelectFlight(flight)}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-300 min-w-[120px]"
            >
              Book
            </button>
          </div>
        </div>

        {/* Additional Flight Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Full Details</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Baggage and Class Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Baggage included</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-gray-400" />
              <span>{travelClass}</span>
            </div>
          </div>
        </div>

        {/* Collapsible Details Section */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {flight.segments.length === 1 ? (
              // Single Segment Details
              <div className="grid grid-cols-2 gap-8">
                {/* Departure Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Departure Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {flight.segments[0].departureAirport.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {flight.segments[0].departureAirport.city},{" "}
                          {flight.segments[0].departureAirport.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {formatTime(
                            flight.segments[0].departureTime,
                            flight.segments[0].departureAirport.timeZone
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(
                            flight.segments[0].departureTime,
                            flight.segments[0].departureAirport.timeZone
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DoorOpen className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">
                          Terminal {flight.segments[0].departureTerminal}
                        </p>
                        <p className="text-sm text-gray-600">
                          Gate {flight.segments[0].departureGate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrival Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Arrival Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {flight.segments[0].arrivalAirport.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {flight.segments[0].arrivalAirport.city},{" "}
                          {flight.segments[0].arrivalAirport.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {formatTime(
                            flight.segments[flight.segments.length - 1]
                              .arrivalTime,
                            flight.segments[flight.segments.length - 1]
                              .arrivalAirport.timezone
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(
                            flight.segments[flight.segments.length - 1]
                              .arrivalTime,
                            flight.segments[flight.segments.length - 1]
                              .arrivalAirport.timezone
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DoorOpen className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">
                          Terminal {flight.segments[0].arrivalTerminal}
                        </p>
                        <p className="text-sm text-gray-600">
                          Gate {flight.segments[0].arrivalGate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Multiple Segments Details
              <div className="space-y-4">
                {flight.segments.map((segment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Flight Segment {index + 1}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Duration:{" "}
                        {calculateDuration(
                          segment.departureTime,
                          segment.arrivalTime
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      {/* Departure Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Departure</h4>
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium text-gray-700">
                              {segment.departureAirport.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {segment.departureAirport.city},{" "}
                              {segment.departureAirport.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-700">
                              {formatTime(segment.departureTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(segment.departureTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <DoorOpen className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Terminal {segment.departureTerminal}
                            </p>
                            <p className="text-sm text-gray-600">
                              Gate {segment.departureGate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Arrival Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Arrival</h4>
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium text-gray-700">
                              {segment.arrivalAirport.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {segment.arrivalAirport.city},{" "}
                              {segment.arrivalAirport.country}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-700">
                              {formatTime(segment.arrivalTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(segment.arrivalTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <DoorOpen className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Terminal {segment.arrivalTerminal}
                            </p>
                            <p className="text-sm text-gray-600">
                              Gate {segment.arrivalGate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layover Information */}
                    {index < flight.segments.length - 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-orange-500">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">
                            {calculateDuration(
                              segment.arrivalTime,
                              flight.segments[index + 1].departureTime
                            )}{" "}
                            layover in {segment.arrivalAirport.city}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OneWayFlight;
