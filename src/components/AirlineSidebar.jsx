/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Home,
  Plane,
  Calendar,
  MessageSquare,
  Map,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const LayoutComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const profilePic = user?.profilepic;

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/airline/dashboard" },
    { icon: Plane, label: "Aircrafts", path: "/airline/aircrafts" },
    { icon: Calendar, label: "Bookings", path: "/airline/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/airline/messages" },
    { icon: Map, label: "Trip Details", path: "/airline/trips" },
    { icon: User, label: "Profile", path: "/airline/profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-blue-600 text-white h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        } flex flex-col fixed left-0 top-0 z-30`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex items-center justify-center mt-4">
          <img
            src={profilePic}
            alt="Profile"
            className="rounded-full w-16 h-16 border-2 border-white object-cover"
          />
        </div>
        <nav className="flex-1 mt-10 overflow-y-auto">
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index} className="mb-4">
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center p-4 hover:bg-blue-700 transition-colors duration-200 w-full text-left"
                >
                  <item.icon size={20} />
                  {isOpen && <span className="ml-4">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mb-4">
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/airline/");
            }}
            className="flex items-center p-2 hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            <LogOut size={20} />
            {isOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex items-center fixed top-0 right-0 left-20 z-20">
          <button onClick={() => setIsOpen(!isOpen)} className="mr-4 lg:hidden">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">SkyScroll</h1>
        </header>
        <main
          className={`flex-1 overflow-y-auto mt-16 p-6 ${
            isOpen ? "ml-64" : "ml-20"
          } transition-all duration-300 ease-in-out`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutComponent;
