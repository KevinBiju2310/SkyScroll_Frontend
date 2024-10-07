import { Home, Users, Plane, LogIn, MapPin, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/userSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Aircrafts", icon: Plane, path: "/admin/aircrafts" },
    { name: "Airline Login", icon: LogIn, path: "/admin/airline-login" },
    { name: "Airports", icon: MapPin, path: "/admin/airports" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin");
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-16 flex flex-col justify-between">
      <nav className="mt-8">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`relative flex justify-center p-4 cursor-pointer hover:bg-gray-700 group ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon size={24} />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-700 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mb-8">
        <div
          className="flex justify-center p-4 cursor-pointer hover:bg-gray-700 group relative"
          onClick={handleLogout}
        >
          <LogOut size={24} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-700 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminHeader = () => {
  return (
    <header className="bg-white shadow-md p-4 w-full">
      <div className="flex items-center">
        {/* <img
          src="/api/placeholder/50/50"
          alt="Logo"
          className="w-10 h-10 mr-4"
        /> */}
        <h1 className="text-xl font-bold text-gray-800">SkySroll</h1>
      </div>
    </header>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export { Sidebar, AdminHeader, AdminLayout };
