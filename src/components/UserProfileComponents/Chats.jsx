import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import ChatSidebar from "../../components/ChatSidebar";
import axiosInstance from "../../config/axiosInstance";
import { useSelector } from "react-redux";

const Chats = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [bookedAirlines, setBookedAirlines] = useState([]);
  const user = useSelector((state) => state.user.user);

  // Handle opening chat sidebar
  const openChatSidebar = (airline) => {
    setSelectedAirline(airline);
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    const fetchBookedAirlines = async () => {
      try {
        const response = await axiosInstance.get("/booked-airlines");
        setBookedAirlines(response.data.response);
      } catch (error) {
        console.error("Error occured:", error);
      }
    };
    fetchBookedAirlines();
  }, []);

  return (
    <div className="relative">
      {/* Blur and darken background when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`relative z-10 ${isSidebarOpen ? "opacity-50" : ""}`}>
        <div className="flex justify-between items-center mt-24 mb-8 px-4">
          <h2 className="text-2xl font-bold">My Chats</h2>
        </div>

        {/* Airline Bookings List */}
        <div className="space-y-4 px-4">
          {bookedAirlines.map((airline) => (
            <div
              key={airline._id}
              className="flex items-center justify-between bg-white shadow rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={airline.profilepic}
                  alt={`${airline.profilepic} logo`}
                  className="w-12 h-12 rounded-full"
                />
                <span className="font-semibold">{airline.airlineName}</span>
              </div>
              <button
                onClick={() => openChatSidebar(airline)}
                className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Chat with Airline
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar
        selectedAirline={selectedAirline}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        currentUser={user._id}
      />
    </div>
  );
};

export default Chats;
