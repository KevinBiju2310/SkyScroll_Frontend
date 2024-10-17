import { useState, useEffect } from "react";
import Popup from "../PopUp";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axiosInstance from "../../config/axiosInstance";

const OtherTravellers = () => {
  const [travellers, setTravellers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchTravellers();
  }, []);

  const fetchTravellers = async () => {
    try {
      const response = await axiosInstance.get("/other-travellers");
      setTravellers(response.data.response);
    } catch (error) {
      console.error("Error fetching travellers:", error);
      setSnackbar({
        open: true,
        message: "Error fetching travellers",
        severity: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveTraveller = async () => {
    if (
      !formData.fullName ||
      !formData.gender ||
      !formData.passportNumber ||
      !formData.nationality ||
      !formData.dateOfBirth
    ) {
      setSnackbar({
        open: true,
        message: "All fields are required!",
        severity: "error",
      });
      return;
    }
    try {
      const response = await axiosInstance.post("/other-travellers", formData);
      fetchTravellers();
      setFormData({
        fullName: "",
        gender: "",
        passportNumber: "",
        nationality: "",
        dateOfBirth: "",
      });
      setIsPopupOpen(false);
      setSnackbar({
        open: true,
        message: "Traveller added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("There was an error saving the traveller:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error adding traveller",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-24">
        <h2 className="text-2xl font-bold">Other Travellers</h2>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Traveller
        </button>
      </div>
      <div className="mt-8">
        {travellers.length > 0 ? (
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Full Name</th>
                <th className="py-2 px-4 border-b text-left">Gender</th>
                <th className="py-2 px-4 border-b text-left">
                  Passport Number
                </th>
                <th className="py-2 px-4 border-b text-left">Nationality</th>
                <th className="py-2 px-4 border-b text-left">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {travellers.map((traveller, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{traveller.fullName}</td>
                  <td className="py-2 px-4">{traveller.gender}</td>
                  <td className="py-2 px-4">{traveller.passportNumber}</td>
                  <td className="py-2 px-4">{traveller.nationality}</td>
                  <td className="py-2 px-4">
                    {new Date(traveller.dateOfBirth).toLocaleDateString("in")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No travellers added yet.</p>
        )}
      </div>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Add New Traveller</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Passport Number</label>
          <input
            type="text"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveTraveller}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save Traveller
          </button>
        </div>
      </Popup>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OtherTravellers;
