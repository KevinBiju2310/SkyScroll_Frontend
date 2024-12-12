/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { X, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotificationsDropdown = ({ socket, userId, onClose, isOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (socket && userId) {
      // Get initial unread notifications
      socket.emit("getUnreadNotifications", userId);

      // Listen for new notifications
      socket.on("newNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Listen for notification updates
      socket.on("unreadNotifications", (notifications) => {
        setNotifications(notifications);
      });

      socket.on("notificationRead", (notificationId) => {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
      });

      socket.on("notificationsCleared", ({ conversationId }) => {
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification.conversationId !== conversationId
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("newNotification");
        socket.off("unreadNotifications");
        socket.off("notificationRead");
        socket.off("notificationsCleared");
      }
    };
  }, [socket, userId]);

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    socket.emit("markNotificationAsRead", { notificationId: notification._id });

    // Navigate to conversation (you'll need to implement this)
    // navigate(`/messages/${notification.conversationId}`);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
      ref={dropdownRef}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No new notifications
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <MessageSquare className="text-blue-500" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
