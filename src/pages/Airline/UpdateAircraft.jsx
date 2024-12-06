import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import {
  Plane,
  Calendar,
  Settings2,
  FileCheck,
  Users,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import AirlineLayout from "../../components/AirlineSidebar";

const UpdateAircraft = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aircraft, setAircraft] = useState();
  const [seatLayouts, setSeatLayouts] = useState({});
  // const [hoveredSeat, setHoveredSeat] = useState(null);
  // const [seats, setSeats] = useState([]);
  //   const [loading, setLoading] = useState(true);

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
      } finally {
        // setLoading(false);
      }
    };
    fetchAircraft();
  }, [id]);

  const initializeSeatGrid = (aircraftData) => {
    if (!aircraftData || !aircraftData.columns) return;

    const columns =
      parseInt(aircraftData.columns) + parseInt(aircraftData.aisles);

    const aisleIdx = Math.floor(columns / 2);
    const seatLayouts = {};

    for (const seatDetail of aircraftData.seatingDetails) {
      const totalSeats = seatDetail.totalSeats;
      const rows = Math.ceil(totalSeats / columns) + 1;

      const seatsArray = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const isAisle = col === aisleIdx; // Aisle is placed at calculated index
          const seatNumber = isAisle
            ? null
            : `${row + 1}${String.fromCharCode(
                65 + col - (col > aisleIdx ? 1 : 0)
              )}`;
          const seatData = seatDetail.seats.find(
            (seat) => seat.seatNumber === seatNumber
          );
          seatsArray.push({
            id: isAisle
              ? `aisle-${row}-${col}`
              : `${seatDetail.class}-${row}-${col}`,
            type: isAisle ? "aisle" : seatData?.type || null,
            seatNumber,
          });
        }
      }

      seatLayouts[seatDetail.class] = { rows, columns, seats: seatsArray };
    }
    setSeatLayouts(seatLayouts);
  };

  const renderSeatRow = (seatLayout, rowIndex) => {
    const rowSeats = seatLayout.seats.filter((seat) =>
      seat.id.includes(`-${rowIndex}-`)
    );

    return (
      <div key={rowIndex} className="flex items-center justify-center">
        {rowSeats.map((seat) => (
          <div
            key={seat.id}
            className={`relative w-12 h-12 m-1 rounded-lg flex items-center justify-center 
              ${
                seat.type === "aisle"
                  ? "bg-gray-300"
                  : seat.type
                  ? "bg-gray-200 cursor-pointer"
                  : "bg-transparent"
              }`}
          >
            {seat.type === "aisle" ? (
              <div className="text-gray-800">Aisle</div>
            ) : seat.type ? (
              seat.seatNumber
            ) : (
              <span className="invisible">Empty</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleConfigSeats = (classType) => {
    navigate(`/airline/aircraft/${id}/seats/${classType}`);
  };

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen">
  //         <Loader className="h-8 w-8 animate-spin text-blue-600" />
  //       </div>
  //     );
  //   }

  if (!aircraft) {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>Aircraft not found or failed to load details.</p>
        </div>
      </div>
    );
  }

  return (
    <AirlineLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Aircraft Details
          </h1>
          <p className="text-gray-500">View and manage aircraft information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Plane className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Model</p>
                  <p className="mt-1">{aircraft.aircraftModel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Registration
                  </p>
                  <p className="mt-1">{aircraft.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Manufacturer
                  </p>
                  <p className="mt-1">{aircraft.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Year</p>
                  <p className="mt-1">{aircraft.yearOfManufacturer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Engine Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Engine Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Engine Manufacturer
                  </p>
                  <p className="mt-1">{aircraft.engineManufacturer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Engine Model
                  </p>
                  <p className="mt-1">{aircraft.engineModel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Serial Number
                  </p>
                  <p className="mt-1">{aircraft.serialNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Maintenance Schedule</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Maintenance
                  </p>
                  <p className="mt-1">
                    {new Date(
                      aircraft.lastMaintenanceDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Next Maintenance
                  </p>
                  <p className="mt-1">
                    {new Date(
                      aircraft.nextMaintenanceDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Documentation</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Approval Status
                  </p>
                  <span
                    className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      aircraft.approvalStatus === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {aircraft.approvalStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Certificate
                  </p>
                  <a
                    href={aircraft.airworthinessCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    View Certificate
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Seating Configuration Card */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Seating Configuration</h2>
              </div>
              {aircraft.seatingDetails && aircraft.seatingDetails.length > 0 ? (
                <div className="space-y-6">
                  {aircraft.seatingDetails.map((seat) => (
                    <div key={seat._id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">
                          {seat.class} Class
                        </h4>
                        <button
                          onClick={() => handleConfigSeats(seat.class)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          Configure Seats
                          <Settings2 className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Total Seats
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {seat.totalSeats}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Available
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {seat.freeSeats}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Window Price
                          </p>
                          <p className="text-xl font-semibold text-gray-900">
                            ${seat.windowPrice}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Aisle Price
                          </p>
                          <p className="text-xl font-semibold text-gray-900">
                            ${seat.aislePrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No seating configuration available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {aircraft.seatingDetails?.length ? (
        <div>
          {Object.keys(seatLayouts).map((classType) => (
            <div
              key={classType}
              className="mt-8 bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Seat Layout for {classType.toUpperCase()} Class
              </h3>
              <div className="flex flex-col items-center space-y-2">
                {seatLayouts[classType].rows > 0 &&
                  Array.from({
                    length: seatLayouts[classType].rows,
                  }).map((_, index) =>
                    renderSeatRow(seatLayouts[classType], index)
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No seating configuration available
        </div>
      )}
    </AirlineLayout>
  );
};

export default UpdateAircraft;
