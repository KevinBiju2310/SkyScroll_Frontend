import AirlineLayout from "../../components/AirlineSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import ConfirmationModal from "../../components/ConfirmationModal";
import Popup from "../../components/PopUp";

const Aircraft = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aircraftIdToDelete, setAircraftIdToDelete] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const navigate = useNavigate();

  const handleView = (id) => {
    const aircraft = aircrafts.find((a) => a._id === id);
    setSelectedAircraft(aircraft);
    setIsPopupOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/airline/deleteaircraft/${id}`
      );
      const updatedAircrafts = aircrafts.filter(
        (aircraft) => aircraft._id !== id
      );
      setAircrafts(updatedAircrafts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAircraft = () => {
    navigate("/airline/aircrafts/addaircraft");
  };

  const handleUpdate = (id) => {
    navigate(`/airline/aircrafts/updateaircraft/${id}`);
  };

  const confirmDelete = (id) => {
    setAircraftIdToDelete(id); // Set the aircraft ID to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleConfirm = () => {
    if (aircraftIdToDelete) {
      handleDelete(aircraftIdToDelete); // Call the delete function
      setIsModalOpen(false); // Close the modal after deletion
    }
  };

  const handleCancel = () => {
    setAircraftIdToDelete(null); // Reset the selected ID
    setIsModalOpen(false); // Close the modal
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedAircraft(null);
  };

  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const response = await axiosInstance.get("/airline/aircrafts");
        console.log(response);
        setAircrafts(response.data.response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAircrafts();
  }, []);

  return (
    <AirlineLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Aircraft</h1>
          <button
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
            onClick={handleAddAircraft}
          >
            Add Aircraft
          </button>
        </div>

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
                  Last Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engine Manufacturer
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
                    {new Date(
                      aircraft.lastMaintenanceDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(
                      aircraft.nextMaintenanceDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {aircraft.engineManufacturer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {aircraft.approvalStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={() => handleView(aircraft._id)}
                    >
                      View
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => confirmDelete(aircraft._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="Are you sure you want to delete this aircraft?"
      />
      <Popup isOpen={isPopupOpen} onClose={handlePopupClose}>
        {selectedAircraft && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-2">
              Aircraft Details
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 font-bold">Model:</span>
                <span className="text-gray-800">
                  {selectedAircraft.aircraftModel}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 font-bold">Registration:</span>
                <span className="text-gray-800">
                  {selectedAircraft.registrationNumber}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 font-bold">
                  Last Maintenance:
                </span>
                <span className="text-gray-800">
                  {new Date(
                    selectedAircraft.lastMaintenanceDate
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 font-bold">
                  Next Maintenance:
                </span>
                <span className="text-gray-800">
                  {new Date(
                    selectedAircraft.nextMaintenanceDate
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 font-bold">
                  Engine Manufacturer:
                </span>
                <span className="text-gray-800">
                  {selectedAircraft.engineManufacturer}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-gray-600 font-bold">
                  Approval Status:
                </span>
                <span
                  className={`font-semibold ${
                    selectedAircraft.approvalStatus === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedAircraft.approvalStatus}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
                onClick={() => handleUpdate(selectedAircraft._id)}
              >
                Update
              </button>
            </div>
          </div>
        )}
      </Popup>
    </AirlineLayout>
  );
};

export default Aircraft;
