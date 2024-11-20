import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AirlineLayout from "../../components/AirlineSidebar";
import axiosInstance from "../../config/axiosInstance";

const SEAT_TYPES = {
  WINDOW: { type: "WINDOW", color: "bg-sky-200", label: "Window" },
  AISLE: { type: "AISLE", color: "bg-emerald-200", label: "Aisle" },
  MIDDLE: { type: "MIDDLE", color: "bg-purple-200", label: "Middle" },
  FREE: { type: "FREE", color: "bg-gray-500", label: "Free" },
};

const Seat = ({ id, seatData, onSeatTypeChange }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "seat",
    item: { id, type: seatData?.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "seatType",
    drop: (item) => {
      onSeatTypeChange(id, item.type);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Only show seat number and color if it has a type assigned
  const seatTypeInfo = seatData ? SEAT_TYPES[seatData.type] : null;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        w-12 h-12 m-1 rounded-lg flex items-center justify-center
        cursor-pointer transition-colors duration-200
        ${seatTypeInfo ? seatTypeInfo.color : "bg-gray-200"}
        ${isDragging ? "opacity-50" : "opacity-100"}
        ${isOver ? "ring-2 ring-blue-500" : ""}
        hover:ring-2 hover:ring-blue-300
        text-sm font-medium
      `}
    >
      {seatData ? seatData.seatNumber : ""}
    </div>
  );
};

const SeatTypeSelector = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "seatType",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const seatTypeInfo = SEAT_TYPES[type];

  return (
    <div
      ref={drag}
      className={`
        w-24 h-12 m-2 rounded-lg flex items-center justify-center
        cursor-move transition-colors duration-200
        ${seatTypeInfo.color}
        ${isDragging ? "opacity-50" : "opacity-100"}
      `}
    >
      {seatTypeInfo.label}
    </div>
  );
};

const SeatConfig = () => {
  const { id, classType } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [seats, setSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState({ rows: 0, columns: 0 });

  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        const response = await axiosInstance.get(`/airline/aircrafts`);
        const aircraftFound = response.data.response.find(
          (aircraft) => aircraft._id === id
        );
        if (aircraftFound) {
          setAircraft(aircraftFound);
          initializeSeatGrid(aircraftFound);
        }
      } catch (error) {
        console.error("Failed to fetch aircraft details", error);
      }
    };
    fetchAircraft();
  }, [id]);

  useEffect(() => {
    if (aircraft) {
      initializeSeatGrid(aircraft);
    }
  }, [aircraft]);

  const getTotalSeatsForClass = () => {
    if (!aircraft || !aircraft.seatingDetails) return 0;
    const seatingDetail = aircraft.seatingDetails.find(
      (detail) => detail.class === classType
    );
    return seatingDetail ? seatingDetail.totalSeats : 0;
  };

  const initializeSeatGrid = (aircraftData) => {
    if (!aircraftData || !aircraftData.columns) return;

    const columns = parseInt(aircraftData.columns);
    const totalSeats = getTotalSeatsForClass();
    const rows = Math.ceil(totalSeats / columns);

    setSeatLayout({ rows, columns });

    const seatingDetail = aircraftData.seatingDetails.find(
      (detail) => detail.class === classType
    );

    const seatsArray = seatingDetail?.seats.length
      ? seatingDetail.seats.map((seat, index) => ({
          id: `${Math.floor(index / columns)}-${index % columns}`,
          type: seat.type,
          seatNumber: seat.seatNumber,
        }))
      : 
        Array.from({ length: rows * columns }).map((_, index) => ({
          id: `${Math.floor(index / columns)}-${index % columns}`,
          type: null,
          seatNumber: `${Math.floor(index / columns) + 1}${String.fromCharCode(
            65 + (index % columns)
          )}`,
        }));
    setSeats(seatsArray);
  };

  const handleSeatTypeChange = (seatId, newType) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId ? { ...seat, type: newType } : seat
      )
    );
  };

  const saveConfiguration = async () => {
    try {
      console.log("hello");
      await axiosInstance.post(`/airline/aircrafts/${id}/seats`, {
        seats,
        classType,
      });
      alert("Seat configuration saved successfull");
    } catch (error) {
      console.error("Error occured", error);
    }
  };

  const renderSeatRow = (rowIndex) => {
    const rowSeats = seats.filter((seat) => seat.id.startsWith(`${rowIndex}`));

    return (
      <div key={rowIndex} className="flex items-center justify-center">
        {rowSeats.map((seat) => (
          <Seat
            key={seat.id}
            seatData={seat.type ? seat : null}
            id={seat.id}
            onSeatTypeChange={handleSeatTypeChange}
          />
        ))}
      </div>
    );
  };

  if (!aircraft) {
    return (
      <AirlineLayout>
        <div className="p-8">
          <p>Loading aircraft details...</p>
        </div>
      </AirlineLayout>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <AirlineLayout>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">
            Seat Configuration for {classType}
          </h2>

          {/* Seat Type Selectors */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Seat Types</h3>
            <div className="flex flex-wrap">
              {Object.keys(SEAT_TYPES).map((type) => (
                <SeatTypeSelector key={type} type={type} />
              ))}
            </div>
          </div>

          {/* Seat Grid */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Seat Layout</h3>
            <div className="flex flex-col items-center space-y-2">
              {seatLayout.rows > 0 &&
                Array.from({ length: seatLayout.rows }).map((_, index) =>
                  renderSeatRow(index)
                )}
            </div>
          </div>

          {/* Layout Information */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Layout Details</h3>
            <p>Aircraft Type: {aircraft.aircraftModel}</p>
            <p>Rows: {seatLayout.rows}</p>
            <p>Columns per row: {aircraft.columns}</p>
            <p>
              Total Seats for {classType}: {seats.length}
            </p>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={saveConfiguration}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </AirlineLayout>
    </DndProvider>
  );
};

export default SeatConfig;
