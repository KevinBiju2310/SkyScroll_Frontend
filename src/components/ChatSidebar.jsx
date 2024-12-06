/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import {
  ChevronRight,
  Send,
  Loader2,
  MessageSquare,
  Check,
  CheckCheck,
} from "lucide-react";
import io from "socket.io-client";
import axiosInstance from "../config/axiosInstance";

const ChatSidebar = ({
  selectedAirline,
  isSidebarOpen,
  closeSidebar,
  currentUser,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socketRef.current = newSocket;
    // setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("join", currentUser);

      if (selectedAirline?._id) {
        newSocket.emit("checkOnlineStatus", selectedAirline?._id);
      }
    });

    newSocket.on("messageReceived", (newMessage) => {
      console.log("New message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (isSidebarOpen && newMessage.sender === selectedAirline._id) {
        newSocket.emit("markMessagesAsSeen", {
          conversationId: selectedAirline._id,
          userId: currentUser,
        });
      }
      scrollToBottom();
    });

    newSocket.on("messagesSeen", ({ by }) => {
      if (by === selectedAirline._id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.sender === currentUser ? { ...msg, seen: true } : msg
          )
        );
      }
    });

    newSocket.on("messageError", (error) => {
      console.error("Message error:", error);
    });
    // Load previous messages
    const fetchPreviousMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `/messages/${selectedAirline._id}`
        );
        setMessages(response.data.response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    };

    // Join room and fetch messages
    if (selectedAirline?._id) {
      fetchPreviousMessages();
    }

    newSocket.on("onlineStatus", ({ userId, isOnline: status }) => {
      if (selectedAirline?._id === userId) {
        setIsOnline(status);
      }
    });

    newSocket.on("userOnline", (userId) => {
      if (selectedAirline?._id === userId) {
        setIsOnline(true);
      }
    });

    newSocket.on("userOffline", (userId) => {
      if (selectedAirline?._id === userId) {
        setIsOnline(false);
      }
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedAirline?._id, currentUser, isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen && selectedAirline?._id && socketRef.current) {
      socketRef.current.emit("markMessagesAsSeen", {
        conversationId: selectedAirline._id,
        userId: currentUser,
      });
    }
  }, [isSidebarOpen, selectedAirline?._id, currentUser]);

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || !socketRef.current || !selectedAirline) return;

    const messageData = {
      senderId: currentUser,
      receiverId: selectedAirline._id,
      text: message.trim(),
      timestamp: new Date(),
    };

    try {
      console.log("Sending message:", messageData);
      socketRef.current.emit("sendMessage", messageData);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((msg) => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  const renderDateDivider = (date) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

    let displayDate = date;
    if (date === today) {
      displayDate = "Today";
    } else if (date === yesterday) {
      displayDate = "Yesterday";
    }

    return (
      <div className="flex items-center justify-center my-4">
        <div className="bg-gray-200 rounded-full px-4 py-1 text-sm text-gray-600">
          {displayDate}
        </div>
      </div>
    );
  };

  const renderMessage = (msg, idx) => (
    <div
      key={idx}
      className={`flex ${
        msg.sender === currentUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] ${
          msg.sender === currentUser
            ? "bg-blue-500 text-white rounded-t-2xl rounded-bl-2xl"
            : "bg-white text-gray-800 rounded-t-2xl rounded-br-2xl border"
        } p-4 shadow-sm relative group hover:shadow-md transition-shadow`}
      >
        <p className="break-words">{msg.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span
            className={`text-xs ${
              msg.sender === currentUser ? "text-blue-100" : "text-gray-400"
            }`}
          >
            {formatMessageTime(msg.timestamp)}
          </span>
          {msg.sender === currentUser && (
            <>
              {msg.seen ? (
                <CheckCheck className="w-5 h-5 text-yellow-900 font-extrabold" />
              ) : (
                <Check className="w-5 h-5 text-blue-300 font-extrabold" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed top-0 right-0 w-[500px] h-full bg-white shadow-2xl transform transition-transform duration-400 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      } z-50 rounded-l-3xl overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {selectedAirline && (
            <div className="relative">
              {selectedAirline.profilepic ? (
                <img
                  src={selectedAirline.profilepic}
                  alt={`${
                    selectedAirline.username
                      ? selectedAirline.username.charAt(0).toUpperCase()
                      : ""
                  } logo`}
                  className="w-14 h-14 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold border-2 border-white">
                  {selectedAirline.username
                    ? selectedAirline.username.charAt(0).toUpperCase()
                    : ""}
                </div>
              )}
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-white">
              {selectedAirline?.airlineName || selectedAirline?.username}
            </h3>
            <p className="text-blue-100 text-sm">
              <span className={`w-2 h-2`} />
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={closeSidebar}
          className="text-white hover:bg-blue-600 p-2 rounded-full transition"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-[calc(100%-180px)] overflow-y-auto p-6 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          Object.entries(groupMessagesByDate(messages)).map(
            ([date, dateMessages]) => (
              <div key={date}>
                {renderDateDivider(date)}
                {dateMessages.map((msg, idx) => renderMessage(msg, idx))}
              </div>
            )
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-4 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-4 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl ${
              message.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
