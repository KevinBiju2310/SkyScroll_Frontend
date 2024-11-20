/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const SeatMap = ({
  flightDetails,
  travelClass,
  onSeatSelect,
  selectedSeats,
}) => {
  const [aircrafts, setAircrafts] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  useEffect(() => {
    const processedAircrafts = flightDetails.segments
      .map((segment) => {
        const matchedClass = segment.aircraft.seatingDetails.find(
          (aircraftClass) => aircraftClass.class === travelClass.toLowerCase()
        );
        return matchedClass
          ? {
              ...segment.aircraft,
              seatingDetails: [matchedClass],
              flightNumber: segment.flightNumber,
              departure: segment.departure,
              arrival: segment.arrival,
            }
          : null;
      })
      .filter(Boolean);
    setAircrafts(processedAircrafts);
  }, [flightDetails, travelClass]);

  const getSeatColor = (seat, segmentIndex) => {
    if (selectedSeats[segmentIndex]?.includes(seat.seatNumber)) {
      return "bg-blue-500 text-white";
    }
    switch (seat.status) {
      case "available":
        return "bg-white hover:bg-blue-100";
      case "occupied":
        return "bg-gray-400 cursor-not-allowed";
      default:
        return "bg-gray-200";
    }
  };

  const getSeatPrice = (seat, aircraft) => {
    const classDetails = aircraft?.seatingDetails.find(
      (detail) => detail.class === travelClass.toLowerCase()
    );
    if (!classDetails) return null;

    switch (seat.type) {
      case "WINDOW":
        return classDetails.windowPrice;
      case "AISLE":
        return classDetails.aislePrice;
      case "MIDDLE":
        return classDetails.middlePrice;
      default:
        return 0;
    }
  };

  const handleSeatClick = (seat, segmentIndex) => {
    if (seat.status === "occupied") return;
    onSeatSelect(seat.seatNumber, segmentIndex);
  };

  const handleMouseEnter = (seat, event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY,
    });
    setHoveredSeat(seat);
  };

  const renderTooltip = (aircraft) => {
    if (!hoveredSeat) return null;

    return (
      <div
        className="absolute z-50 bg-gray-800 text-white p-2 rounded-lg text-sm shadow-lg"
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex flex-col gap-1">
          <p>Seat: {hoveredSeat.seatNumber}</p>
          <p>Type: {hoveredSeat.type}</p>
          <p>Status: {hoveredSeat.status}</p>
          <p>Price: ₹{getSeatPrice(hoveredSeat, aircraft)}</p>
        </div>
      </div>
    );
  };

  const getSeatRows = (aircraft) => {
    if (!aircraft) return [];

    const classSeats = aircraft.seatingDetails[0]?.seats || [];
    const numColumns = Number(aircraft.columns);
    const rows = [];

    for (let i = 0; i < classSeats.length; i += numColumns) {
      rows.push(classSeats.slice(i, i + numColumns));
    }

    return rows;
  };

  const renderSeatMap = (aircraft, index) => (
    <div className="w-full max-w-4xl mx-auto mb-8 relative">
      {/* Flight Info */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">
          {/* Flight {aircraft.flightNumber} - {aircraft.departure} to{" "} */}
          {/* {aircraft.arrival} */}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Selected Seats: {selectedSeats[index]?.join(", ") || "None"}
        </p>
      </div>

      {/* Seat Grid */}
      <div className="grid gap-2 p-4 bg-gray-100 rounded-lg">
        {getSeatRows(aircraft).map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            <div className="w-8 flex items-center justify-center text-gray-500">
              {rowIndex + 1}
            </div>
            {row.map((seat) =>
              seat.type ? (
                <button
                  key={seat.seatNumber}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${getSeatColor(
                    seat,
                    index
                  )}`}
                  onClick={() => handleSeatClick(seat, index)}
                  onMouseEnter={(e) => handleMouseEnter(seat, e)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  disabled={seat.status === "occupied"}
                >
                  {seat.seatNumber}
                </button>
              ) : (
                <div
                  key={`placeholder-${seat.seatNumber}`}
                  className="w-10 h-10 flex items-center justify-center"
                ></div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredSeat && renderTooltip(aircraft)}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Seat Map Legend</h4>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-6 h-6 border rounded mr-2 bg-white"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 border rounded mr-2 bg-blue-500"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 border rounded mr-2 bg-gray-400"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>

      {/* Segment Navigation */}
      <div className="flex gap-2 mb-4">
        {aircrafts.map((aircraft, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg ${
              activeSegmentIndex === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveSegmentIndex(index)}
          >
            Flight {index + 1}
          </button>
        ))}
      </div>

      {/* Active Segment Seat Map */}
      {renderSeatMap(aircrafts[activeSegmentIndex], activeSegmentIndex)}
    </div>
  );
};

export default SeatMap;
