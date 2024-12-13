/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Home,
  Plane,
  Calendar,
  MessageSquare,
  Map,
  User,
  LogOut,
  Menu,
  Bell,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationDropdown";
import io from "socket.io-client";

const LayoutComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const profilePic = user?.profilepic;
  const [socket, setSocket] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/airline/dashboard" },
    { icon: Plane, label: "Aircrafts", path: "/airline/aircrafts" },
    { icon: Calendar, label: "Bookings", path: "/airline/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/airline/messages" },
    { icon: Map, label: "Trip Details", path: "/airline/trips" },
    { icon: User, label: "Profile", path: "/airline/profile" },
  ];

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_BASE_URL, {
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        newSocket.emit("join", user._id);
      });

      return () => {
        if (newSocket) newSocket.close();
      };
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", () => {
        setNotificationCount((prev) => prev + 1);
      });

      socket.on("notificationRead", () => {
        setNotificationCount((prev) => Math.max(0, prev - 1));
      });

      socket.on("notificationsCleared", () => {
        setNotificationCount(0);
      });

      socket.on("unreadNotifications", (notifications) => {
        setNotificationCount(notifications.length);
      });

      return () => {
        socket.off("newNotification");
        socket.off("notificationRead");
        socket.off("notificationsCleared");
        socket.off("unreadNotifications");
      };
    }
  }, [socket]);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

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

          {/* Bell Notification Icon */}
          <button onClick={toggleNotifications} className="relative ml-auto">
            <Bell size={24} className="text-gray-800" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationsDropdown
              socket={socket}
              userId={user._id}
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}
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
