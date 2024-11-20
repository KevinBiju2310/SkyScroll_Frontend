/* eslint-disable react/prop-types */
const RoundTripFlight = ({
  outboundFlight,
  returnFlight,
  passengerCount,
  travelClass,
  onSelectFlight,
}) => {
  // Calculate total price for a complete flight (outbound or return)
  const calculateTotalFlightPrice = (flight) => {
    return flight.ticketPrices[travelClass.toLowerCase()];
  };

  // Render flight segments without individual price calculation
  const renderFlightDetails = (flightSegments) => {
    console.log(flightSegments);
    return flightSegments.segments.map((segment, index) => (
      <div
        key={segment._id || index}
        className="flex justify-between items-center border-b last:border-none pb-2 mb-2"
      >
        <div>
          <p className="text-sm text-gray-600">{segment.departureTime}</p>
          <p className="font-semibold text-gray-800">{segment.airline}</p>
          <p className="text-gray-600">
            {segment.departureAirport.code} → {segment.arrivalAirport.code}
          </p>
          <p className="text-sm text-gray-500">{segment.duration}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="border rounded-lg shadow-lg p-6 space-y-4 bg-white">
      <h2 className="text-xl font-semibold text-gray-900">Round-Trip Flight</h2>

      {/* Outbound Flight */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Outbound Flight</h3>
        {renderFlightDetails(outboundFlight)}
        <div className="text-right">
          <p className="font-bold text-lg text-gray-800">
            Total Price: ${calculateTotalFlightPrice(outboundFlight)}
          </p>
        </div>
      </div>

      {/* Return Flight */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Return Flight</h3>
        {renderFlightDetails(returnFlight)}
        <div className="text-right">
          <p className="font-bold text-lg text-gray-800">
            Total Price: ${calculateTotalFlightPrice(returnFlight)}
          </p>
        </div>
      </div>

      {/* Combined Selection Button */}
      <div className="text-center">
        <button
          onClick={() => onSelectFlight([outboundFlight, returnFlight])}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md"
        >
          Select Round Trip
        </button>
      </div>
    </div>
  );
};

export default RoundTripFlight;
