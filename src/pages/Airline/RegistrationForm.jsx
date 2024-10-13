import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import background from "../../assets/background.jpg";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    iataCode: "",
    country: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    designation: "",
    airlineLicense: null,
    insuranceCertificate: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const nextStep = () => {
    const isValid = validateStep(step);
    if (isValid) {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  const validateStep = (step) => {
    let newErrors = {};
    const publicEmailDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];

    switch (step) {
      case 1:
        if (!formData.companyName)
          newErrors.companyName = "Company Name is required.";
        if (!formData.iataCode) newErrors.iataCode = "IATA Code is required.";
        if (!formData.country) newErrors.country = "Country is required.";
        break;
      case 2:
        if (!formData.contactName)
          newErrors.contactName = "Contact Name is required.";

        // Email validation
        if (!formData.contactEmail) {
          newErrors.contactEmail = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          newErrors.contactEmail = "Email is not valid.";
        } else {
          const emailDomain = formData.contactEmail.split("@")[1];
          if (publicEmailDomains.includes(emailDomain)) {
            newErrors.contactEmail =
              "Public email domains (e.g., gmail.com) are not allowed. Please use a company email.";
          }
        }

        // Phone validation
        if (!formData.contactPhone) {
          newErrors.contactPhone = "Phone number is required.";
        } else if (!/^\+?[0-9]{7,15}$/.test(formData.contactPhone)) {
          newErrors.contactPhone = "Phone number is not valid.";
        }

        if (!formData.designation)
          newErrors.designation = "Designation is required.";
        break;
      case 3:
        if (!formData.airlineLicense)
          newErrors.airlineLicense = "Airline License is required.";
        if (!formData.insuranceCertificate)
          newErrors.insuranceCertificate = "Insurance Certificate is required.";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    try {
      const submitData = new FormData();
      submitData.append("airlineName", formData.companyName);
      submitData.append("iataCode", formData.iataCode);
      submitData.append("country", formData.country);
      submitData.append("username", formData.contactName);
      submitData.append("email", formData.contactEmail);
      submitData.append("phone", formData.contactPhone);
      submitData.append("designation", formData.designation);

      if (formData.airlineLicense) {
        submitData.append("licenseDocument", formData.airlineLicense);
      }
      if (formData.insuranceCertificate) {
        submitData.append("insuranceDocument", formData.insuranceCertificate);
      }

      // Post form data to the backend
      const response = await axiosInstance.post(
        "/airline/register",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Registration successful:", response);
      // Navigate to another page or show success message
      // navigate("/success");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Step 1: Company Information
            </h3>
            <div className="mb-6">
              <label htmlFor="companyName" className="block mb-2 text-lg">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.companyName && (
                <p className="text-red-500">{errors.companyName}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="iataCode" className="block mb-2 text-lg">
                IATA Code
              </label>
              <input
                type="text"
                id="iataCode"
                name="iataCode"
                value={formData.iataCode}
                onChange={handleInputChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.iataCode && (
                <p className="text-red-500">{errors.iataCode}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="country" className="block mb-2 text-lg">
                Country of Operation
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.country && (
                <p className="text-red-500">{errors.country}</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Step 2: Contact Information
            </h3>
            <div className="mb-6">
              <label htmlFor="contactName" className="block mb-2 text-lg">
                Name
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.contactName && (
                <p className="text-red-500">{errors.contactName}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="contactEmail" className="block mb-2 text-lg">
                Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.contactEmail && (
                <p className="text-red-500">{errors.contactEmail}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="contactPhone" className="block mb-2 text-lg">
                Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.contactPhone && (
                <p className="text-red-500">{errors.contactPhone}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="designation" className="block mb-2 text-lg">
                Designation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.designation && (
                <p className="text-red-500">{errors.designation}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Step 3: Document Upload
            </h3>
            <div className="mb-6">
              <label htmlFor="airlineLicense" className="block mb-2 text-lg">
                Airline License
              </label>
              <input
                type="file"
                id="airlineLicense"
                name="airlineLicense"
                onChange={handleFileChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.airlineLicense && (
                <p className="text-red-500">{errors.airlineLicense}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="insuranceCertificate"
                className="block mb-2 text-lg"
              >
                Insurance Certificate
              </label>
              <input
                type="file"
                id="insuranceCertificate"
                name="insuranceCertificate"
                onChange={handleFileChange}
                className="w-full p-3 border rounded text-lg"
                required
              />
              {errors.insuranceCertificate && (
                <p className="text-red-500">{errors.insuranceCertificate}</p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Step 4: Review and Submit
            </h3>
            <div className="mb-6">
              <h4 className="font-semibold text-lg">Company Information</h4>
              <p className="text-lg">Company Name: {formData.companyName}</p>
              <p className="text-lg">IATA Code: {formData.iataCode}</p>
              <p className="text-lg">Country: {formData.country}</p>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-lg">Contact Information</h4>
              <p className="text-lg">Name: {formData.contactName}</p>
              <p className="text-lg">Email: {formData.contactEmail}</p>
              <p className="text-lg">Phone: {formData.contactPhone}</p>
              <p className="text-lg">Designation: {formData.designation}</p>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-lg">Uploaded Documents</h4>
              <p className="text-lg">
                Airline License:{" "}
                {formData.airlineLicense
                  ? formData.airlineLicense.name
                  : "Not uploaded"}
              </p>
              <p className="text-lg">
                Insurance Certificate:{" "}
                {formData.insuranceCertificate
                  ? formData.insuranceCertificate.name
                  : "Not uploaded"}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 h-100">
        <h2 className="text-3xl font-bold mb-6">
          Airline Company Registration
        </h2>

        {/* Render form steps */}
        {renderStep()}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg flex items-center text-lg"
            >
              <ArrowLeft className="mr-2" size={24} /> Previous
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center ml-auto text-lg"
            >
              Next <ArrowRight className="ml-2" size={24} />
            </button>
          ) : (
            <button
              type="button" // Change this to button type="button"
              onClick={handleSubmit} // Call handleSubmit explicitly here
              className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center ml-auto text-lg"
            >
              Submit Application
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-lg">
          Already have an account?{" "}
          <button
            onClick={() => {
              navigate("/airline/");
            }}
            className="text-blue-500 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
