import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import {
  Eye,
  Check,
  X,
  Loader2,
  FileText,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { AdminLayout } from "../../components/AdminLayout";
import Popup from "../../components/PopUp";
import ConfirmationModal from "../../components/ConfirmationModal";

const AirlineLoginDetails = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [airlineToToggle, setAirlineToToggle] = useState(null);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const response = await axiosInstance.get("/admin/airlines");
      setAirlines(response.data.response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Error fetching airline data");
      setLoading(false);
    }
  };

  const openPopup = (airline) => {
    setSelectedAirline(airline);
    setIsPopupOpen(true);
  };

  const confirmToggleStatus = (airline) => {
    setAirlineToToggle(airline);
    setIsModalOpen(true);
  };

  const toggleStatus = async () => {
    if (!airlineToToggle) return;
    try {
      setIsModalOpen(false);
      setAirlines((prevUsers) =>
        prevUsers.map((user) =>
          user._id === airlineToToggle._id
            ? { ...user, isVerified: !user.isVerified }
            : user
        )
      );
      await axiosInstance.patch(
        `/admin/togglestatusairline/${airlineToToggle._id}`,
        {}
      );
    } catch (err) {
      console.error("Failed to toggle airline block status", err);
    } finally {
      setAirlineToToggle(null);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="text-center p-4 text-red-500 font-semibold">
          {error}
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Airline Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Contact Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {airlines.map((airline, index) => (
                <tr key={airline._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {airline.airlineName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {airline.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {airline.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {airline.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => confirmToggleStatus(airline)} // Open modal when clicking status
                      className="flex items-center"
                    >
                      {airline.isVerified ? (
                        <span className="text-green-600 flex items-center">
                          <ToggleRight className="w-5 h-5 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <ToggleLeft className="w-5 h-5 mr-1" /> Rejected
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openPopup(airline)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        {selectedAirline && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
              {selectedAirline.airlineName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contact Name
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAirline.username}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contact Email
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAirline.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contact Phone
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAirline.phone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Country of Operation
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAirline.country}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Designation</p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAirline.designation}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">IATA Code</p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAirline.iataCode}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  License Document
                </p>
                <a
                  href={selectedAirline.licenseDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" /> View License
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Insurance Document
                </p>
                <a
                  href={selectedAirline.insuranceDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" /> View Insurance
                </a>
              </div>
            </div>
            {/* <div className="flex justify-end space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Check className="w-4 h-4 mr-2" /> Approve
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <X className="w-4 h-4 mr-2" /> Reject
              </button>
            </div> */}
          </div>
        )}
      </Popup>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={toggleStatus} // Call toggleStatus if confirmed
        onCancel={() => setIsModalOpen(false)} // Close modal on cancel
        message={`Are you sure you want to ${
          airlineToToggle?.isVerified ? "reject" : "approve"
        } the airline "${airlineToToggle?.airlineName}"?`}
      />
    </AdminLayout>
  );
};

export default AirlineLoginDetails;
