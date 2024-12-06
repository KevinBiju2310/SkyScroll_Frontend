import { useLocation, Link } from "react-router-dom";
import { Check, Home, Calendar } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PaymentSuccess = () => {
  const location = useLocation();
  const { paymentId } = location.state;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white">
      <Header />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 animate-bounce">
              <Check className="w-8 h-8 text-green-600" />
            </div>

            {/* Success Message */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Payment Successful! 🎉
              </h2>
              <p className="text-gray-600">
                Thank you for your payment. Your transaction has been completed
                successfully.
              </p>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment ID</span>
                <span className="font-medium">{paymentId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("in")}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center px-4 py-3 border border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Bookings
              </Link>
            </div>

            {/* Additional Information */}
            <div className="text-center text-sm text-gray-500">
              <p>
                A confirmation email has been sent to your registered email
                address.
              </p>
              <p className="mt-2">
                Need help?{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
