import { useEffect, useState } from "react";
import AirlineLayout from "../../components/AirlineSidebar";
import axiosInstance from "../../config/axiosInstance";
import ChatSidebar from "../../components/ChatSidebar";
import { useSelector } from "react-redux";

const Messages = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [bookedUsers, setBookedUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const airline = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchBookedUsers = async () => {
      try {
        const response = await axiosInstance.get("/airline/booked-users");
        setBookedUsers(response.data.response);
      } catch (error) {
        console.error("Error fetching booked users:", error);
      }
    };

    fetchBookedUsers();
  }, []);

  const openChatSidebar = (user) => {
    setActiveChat(user);
    setIsSidebarOpen(true);
  };

  return (
    <AirlineLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Chat with your users and provide support
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-lg">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openChatSidebar(user)}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Chat with {user.username}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Sidebar */}
      {isSidebarOpen && (
        <ChatSidebar
          selectedAirline={activeChat}
          isSidebarOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
          currentUser={airline._id}
        />
      )}
    </AirlineLayout>
  );
};

export default Messages;
