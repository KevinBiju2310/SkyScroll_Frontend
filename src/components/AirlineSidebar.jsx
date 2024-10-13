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
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const LayoutComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: Home, label: "Dashboard" },
    { icon: Plane, label: "Aircrafts" },
    { icon: Calendar, label: "Bookings" },
    { icon: MessageSquare, label: "Messages" },
    { icon: Map, label: "Trip Details" },
    { icon: User, label: "Profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-blue-600 text-white h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        } flex flex-col fixed left-0 top-0 z-30`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <nav className="flex-1 mt-10">
          {" "}
          {/* Added margin-top here */}
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index} className="mb-4">
                {" "}
                {/* Increased bottom margin */}
                <a
                  href="#"
                  className="flex items-center p-4 hover:bg-blue-700 transition-colors duration-200"
                >
                  <item.icon size={20} />
                  {isOpen && <span className="ml-4">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mb-4">
          {" "}
          {/* Added margin-bottom */}
          <button className="flex items-center p-2 hover:bg-blue-700 transition-colors duration-200 w-full">
            <LogOut size={20} />
            {isOpen && (
              <span
                onClick={() => {
                  dispatch(logout());
                  navigate("/airline/");
                }}
                className="ml-4"
              >
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div
        className={`flex-1 ${
          isOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <header className="bg-white shadow-md p-4 fixed top-0 right-0 left-20 z-20 flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="mr-4 lg:hidden">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">SkyScroll</h1>
        </header>

        {/* Main content */}
        <main className="mt-20 p-6">
          {" "}
          {/* Increased top margin to prevent overlap */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutComponent;
