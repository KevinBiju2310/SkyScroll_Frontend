import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import ConfirmationModal from "../../components/ConfirmationModal";
import axiosInstance from "../../utils/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/admin/users");
        setUsers(response.data.response);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      await axiosInstance.patch(`/admin/toggleblock/${selectedUser._id}`, {});
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, isBlocked: !user.isBlocked }
            : user
        )
      );
    } catch (err) {
      console.error("Failed to toggle user block status", err);
    } finally {
      setIsModalOpen(false); // Close the modal
      setSelectedUser(null); // Reset selected user
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading)
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div>Error: {error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      user.isBlocked
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() =>
                      openModal(user, user.isBlocked ? "Unblock" : "Block")
                    }
                    className={`px-3 py-1 rounded ${
                      user.isBlocked
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={`Are you sure you want to ${actionType} the user "${
          selectedUser ? selectedUser.username : ""
        }"?`}
      />
    </AdminLayout>
  );
};

export default Users;
