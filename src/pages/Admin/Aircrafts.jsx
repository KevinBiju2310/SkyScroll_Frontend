import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { AdminLayout } from "../../components/AdminLayout";
import Popup from "../../components/PopUp";

const Aircrafts = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const response = await axiosInstance.get("/admin/aircrafts");
        setAircrafts(response.data.response);
      } catch (error) {
        console.error("Error fetching aircrafts", error);
      }
    };

    fetchAircrafts();
  }, []);

  const handleViewAircraft = (aircraft) => {
    setSelectedAircraft(aircraft);
    setNewStatus(aircraft.approvalStatus);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedAircraft(null);
    setIsPopupOpen(false);
  };

  const handleStatusChange = async (aircraftId, newStatus) => {
    try {
      await axiosInstance.patch(`/admin/aircrafts/${aircraftId}`, {
        approvalStatus: newStatus,
      });
      const updatedAircrafts = aircrafts.map((aircraft) =>
        aircraft._id === aircraftId
          ? { ...aircraft, approvalStatus: newStatus }
          : aircraft
      );
      setAircrafts(updatedAircrafts);
      setSelectedAircraft({ ...selectedAircraft, approvalStatus: newStatus });
      setSelectedAircraft(null);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error updating approval status", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Aircrafts</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Airline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aircrafts.map((aircraft) => (
                <tr key={aircraft._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {aircraft.aircraftModel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {aircraft.registrationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {aircraft.airline?.airlineName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {aircraft.approvalStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => handleViewAircraft(aircraft)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedAircraft && (
          <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Aircraft Details: {selectedAircraft.aircraftModel}
              </h2>
              <p>
                <strong>Registration Number:</strong>
                {selectedAircraft.registrationNumber}
              </p>
              <p>
                <strong>Manufacturer:</strong> {selectedAircraft.manufacturer}
              </p>
              <p>
                <strong>Engine Manufacturer:</strong>
                {selectedAircraft.engineManufacturer}
              </p>
              <p>
                <strong>Last Maintenance:</strong>
                {new Date(
                  selectedAircraft.lastMaintenanceDate
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Next Maintenance:</strong>
                {new Date(
                  selectedAircraft.nextMaintenanceDate
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Airworthiness Certificate:</strong>
                <a
                  href={selectedAircraft.airworthinessCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Certificate
                </a>
              </p>
              <p>
                <strong>Responsible Airline:</strong>{" "}
                {selectedAircraft.airline?.airlineName || "N/A"}
              </p>

              {/* Dropdown for updating approval status */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Approval Status:
                </label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() =>
                    handleStatusChange(selectedAircraft._id, newStatus)
                  }
                >
                  Update Status
                </button>
              </div>
            </div>
          </Popup>
        )}
      </div>
    </AdminLayout>
  );
};

export default Aircrafts;
