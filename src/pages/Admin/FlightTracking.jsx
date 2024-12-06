import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { Search, MapPinCheckInside, Clock, Plane } from "lucide-react";
import axiosInstance from "../../config/axiosInstance";
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2t5c2Nyb2xsIiwiYSI6ImNtMjdmcDVsdjBua3kybHM2Yjg5eHFjZW8ifQ.DDjEvia0H06UVd5hFCzGPw";

const FlightTracking = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: -96,
    latitude: 37.8,
    zoom: 3,
  });

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const response = await axiosInstance.get("/admin/trips");
        setTrips(response.data.response);
        setFilteredTrips(response.data.response);
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTrips();
  }, []);

  useEffect(() => {
    const filtered = trips.filter((trip) => {
      const searchLower = searchQuery.toLowerCase();
      const airlineName = (trip.airline.name || "").toLowerCase();
      const hasMatchingSegment = trip.segments.some(
        (segment) =>
          segment.flightNumber.toLowerCase().includes(searchLower) ||
          segment.departureAirport.name.toLowerCase().includes(searchLower) ||
          segment.arrivalAirport.name.toLowerCase().includes(searchLower)
      );

      return airlineName.includes(searchLower) || hasMatchingSegment;
    });
    setFilteredTrips(filtered);
  }, [searchQuery, trips]);

  const handleTripClick = (trip, segment) => {
    setSelectedTrip(trip);
    setSelectedSegment(segment);

    const lng =
      (segment.departureAirport.longitude + segment.arrivalAirport.longitude) /
      2;
    const lat =
      (segment.departureAirport.latitude + segment.arrivalAirport.latitude) / 2;

    const deltaLon = Math.abs(
      segment.departureAirport.longitude - segment.arrivalAirport.longitude
    );
    const deltaLat = Math.abs(
      segment.departureAirport.latitude - segment.arrivalAirport.latitude
    );
    const maxDelta = Math.max(deltaLon, deltaLat);
    const zoom = Math.floor(8 - Math.log2(maxDelta));

    setViewport({
      longitude: lng,
      latitude: lat,
      zoom: Math.min(Math.max(zoom, 2), 10),
    });
  };

  const formatDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const diffMinutes = Math.round((arrival - departure) / (1000 * 60));

    const hours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  const getMidpoint = (segment) => {
    return {
      longitude:
        (segment.departureAirport.longitude +
          segment.arrivalAirport.longitude) /
        2,
      latitude:
        (segment.departureAirport.latitude + segment.arrivalAirport.latitude) /
        2,
    };
  };

  const routeLayer = selectedSegment && {
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#1fabcf",
      "line-width": 4,
      "line-opacity": 0.9,
    },
  };

  const routeData = selectedSegment && {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [
          selectedSegment.departureAirport.longitude,
          selectedSegment.departureAirport.latitude,
        ],
        [
          selectedSegment.arrivalAirport.longitude,
          selectedSegment.arrivalAirport.latitude,
        ],
      ],
    },
  };

  const handleMarkerClick = (airport, type) => {
    const info = {
      longitude: airport.longitude,
      latitude: airport.latitude,
      name: airport.name,
      terminal:
        type === "departure"
          ? selectedSegment.departureTerminal
          : selectedSegment.arrivalTerminal,
      gate:
        type === "departure"
          ? selectedSegment.departureGate
          : selectedSegment.arrivalGate,
      type: type,
    };
    setPopupInfo(info);
  };

  //   console.log(selectedSegment);
  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Flight Tracking</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search by airline, flight number, or airport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-600">Loading flight data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Available Flights
              </h2>
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                {filteredTrips.map((trip) =>
                  trip.segments.map((segment, index) => (
                    <div
                      key={`${trip._id}-${index}`}
                      className={`p-5 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${
                        selectedTrip?._id === trip._id &&
                        selectedSegment === segment
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-blue-400 hover:bg-gray-100"
                      }`}
                      onClick={() => handleTripClick(trip, segment)}
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            ✈️ {trip.airline.airlineName || "Unknown Airline"}
                          </h3>
                          <p className="text-gray-500">
                            Flight: {segment.flightNumber}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            segment.status === "On-Time"
                              ? "bg-green-100 text-green-600"
                              : segment.status === "Delayed"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {segment.status}
                        </span>
                      </div>

                      {/* Flight Details */}
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                        {/* Departure */}
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <svg
                              className="w-6 h-6 text-blue-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16.88 3.549a9.353 9.353 0 016.254 2.963 9.354 9.354 0 01.162 13.123l-.172.178-7.421 7.422a1 1 0 01-1.414 0l-7.42-7.42a9.354 9.354 0 01-.178-13.123 9.353 9.353 0 0113.123-.178l.166.165.174-.173zm0 1.414a7.353 7.353 0 00-10.437 0 7.353 7.353 0 000 10.437l7.422 7.422 7.422-7.421a7.353 7.353 0 000-10.438l-.174-.173-.166.165z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">
                              {segment.departureAirport.name}
                            </p>
                            <p className="text-gray-500">
                              Terminal {segment.departureTerminal} • Gate{" "}
                              {segment.departureGate}
                            </p>
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="flex items-start text-right">
                          <div className="flex-shrink-0 mr-3">
                            <svg
                              className="w-6 h-6 text-green-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3.055 11H5.93a4.002 4.002 0 017.04 0h8.011M9 21l3-3-3-3M9 3l3 3-3 3"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">
                              {segment.arrivalAirport.name}
                            </p>
                            <p className="text-gray-500">
                              Terminal {segment.arrivalTerminal} • Gate{" "}
                              {segment.arrivalGate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <div className="border rounded-lg overflow-hidden h-[calc(100vh-300px)]">
                <Map
                  {...viewport}
                  onMove={(evt) => setViewport(evt.viewport)}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
                  mapboxAccessToken={MAPBOX_TOKEN}
                >
                  <NavigationControl position="top-right" />
                  <FullscreenControl position="top-right" />
                  <GeolocateControl position="top-right" />

                  {selectedSegment && (
                    <>
                      <Marker
                        longitude={selectedSegment.departureAirport.longitude}
                        latitude={selectedSegment.departureAirport.latitude}
                        anchor="center"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          handleMarkerClick(
                            selectedSegment.departureAirport,
                            "departure"
                          );
                        }}
                      >
                        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-110" />
                      </Marker>

                      <Marker
                        longitude={selectedSegment.arrivalAirport.longitude}
                        latitude={selectedSegment.arrivalAirport.latitude}
                        anchor="bottom"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          handleMarkerClick(
                            selectedSegment.arrivalAirport,
                            "arrival"
                          );
                        }}
                      >
                        <MapPinCheckInside className="text-red-800 text-8xl" />
                      </Marker>

                      <Marker
                        longitude={getMidpoint(selectedSegment).longitude}
                        latitude={getMidpoint(selectedSegment).latitude}
                        anchor="center"
                      >
                        <div className="bg-white px-3 py-1 rounded-full shadow-lg border border-gray-200 flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-600" />
                          <span className="text-sm font-medium">
                            {formatDuration(
                              selectedSegment.departureTime,
                              selectedSegment.arrivalTime
                            )}
                          </span>
                        </div>
                      </Marker>

                      <Source type="geojson" data={routeData}>
                        <Layer {...routeLayer} />
                      </Source>
                      {popupInfo && (
                        <Popup
                          longitude={popupInfo.longitude}
                          latitude={popupInfo.latitude}
                          anchor="top"
                          onClose={() => setPopupInfo(null)}
                          className="z-50"
                        >
                          <div className="p-3 min-w-[200px]">
                            <h3 className="font-bold text-base mb-2">
                              {popupInfo.name}
                            </h3>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Terminal:</span>{" "}
                                {popupInfo.terminal}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Gate:</span>{" "}
                                {popupInfo.gate}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {popupInfo.type === "departure"
                                  ? "Departure Airport"
                                  : "Arrival Airport"}
                              </p>
                            </div>
                          </div>
                        </Popup>
                      )}
                    </>
                  )}
                </Map>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FlightTracking;
