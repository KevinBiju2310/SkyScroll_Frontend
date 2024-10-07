import { useState, useEffect } from "react";
import Popup from "./PopUp";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Plane,
  User,
  Settings,
  DoorOpen,
} from "lucide-react";
import RegisterForm from "../pages/RegisterForm";
import LoginForm from "../pages/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../src/redux/userSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  console.log(user);
  const openRegisterPopup = () => {
    setPopupContent("register");
    setIsPopupOpen(true);
  };

  const openLoginPopup = () => {
    setPopupContent("login");
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  const switchToLogin = () => {
    setPopupContent("login");
  };

  const switchToRegister = () => {
    setPopupContent("register");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        openLoginPopup();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const AuthButtons = () => {
    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300 flex items-center"
          >
            <Settings size={18} className="mr-2" />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition duration-300 flex items-center"
          >
            <DoorOpen size={18} className="mr-2" />
            Logout
          </button>
        </div>
      );
    } else {
      return (
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={openRegisterPopup}
            className="bg-white text-sky-600 px-4 py-2 rounded-full hover:bg-sky-100 transition duration-300 flex items-center"
          >
            <User size={18} className="mr-2" />
            Register
          </button>
          <button
            onClick={openLoginPopup}
            className="bg-sky-700 hover:bg-sky-600 px-4 py-2 rounded-full transition duration-300 flex items-center"
          >
            <LogIn size={18} className="mr-2" />
            Login
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg">
        <div className="px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Name */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Plane className="text-sky-600" size={24} />
              </div>
              <span className="font-semibold text-xl">SkyScroll</span>
            </div>

            {/* Navigation Links (hidden on mobile) */}
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="hover:text-sky-100 transition duration-300"
              >
                Home
              </a>
              <a
                href="#"
                className="hover:text-sky-100 transition duration-300"
              >
                Flights
              </a>
              <a
                href="#"
                className="hover:text-sky-100 transition duration-300"
              >
                Deals
              </a>
            </nav>

            {/* Auth Buttons */}
            <AuthButtons />

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 flex flex-col">
              <nav className="flex flex-col items-center space-y-4 w-full">
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Flights
                </a>
                <a
                  href="#"
                  className="hover:text-sky-100 transition duration-300"
                >
                  Deals
                </a>
              </nav>
              <div className="mt-4 space-y-2">
                <button className="w-full bg-white text-sky-600 px-4 py-2 rounded-full hover:bg-sky-100 transition duration-300 flex items-center justify-center">
                  <UserPlus size={18} className="mr-2" />
                  Register
                </button>
                <button className="w-full bg-sky-700 hover:bg-sky-600 px-4 py-2 rounded-full transition duration-300 flex items-center justify-center">
                  <LogIn size={18} className="mr-2" />
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        {popupContent === "register" && (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}
        {popupContent === "login" && (
          <LoginForm
            onSwitchToRegister={switchToRegister}
            onClose={closePopup}
          />
        )}
      </Popup>
    </>
  );
};

export default Header;
