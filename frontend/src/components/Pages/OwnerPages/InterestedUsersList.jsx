import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/PropertyList.css"; // Reuse the same CSS file for consistent styling
import Modal from "../Modal"; // Import the Modal component
import { FaEye } from "react-icons/fa"; // Use a suitable icon for viewing details

const InterestedUsersList = () => {
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      try {
        const response = await axios.get(
          "/api/v1/owner/property/all/interested",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setInterestedUsers(response.data.interestedUsers || []);
        } else {
          setError("Failed to fetch interested users.");
          console.error(response.data.message);
        }
      } catch (error) {
        setError("Error fetching interested users data.");
        console.error("Error fetching interested users:", error);
      }
    };

    fetchInterestedUsers();
  }, [token]);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="property-list">
      <h1>Interested Users List</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="property-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Property Project</th>
            <th>Interested Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(interestedUsers) && interestedUsers.length > 0 ? (
            interestedUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.name || "N/A"}</td>
                <td>{user.projectName || "N/A"}</td>
                <td>
                  {user.interestedDate
                    ? new Date(user.interestedDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleViewDetails(user)}
                  >
                    <FaEye /> View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No interested users found</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        {selectedUser && (
          <div className="user-view-detail-form">
            <h2>User Details</h2>
            <p>Name: {selectedUser.name || "N/A"}</p>
            <p>Phone: {selectedUser.phone || "N/A"}</p>
            <p>Email: {selectedUser.email || "N/A"}</p>
            <p>
              Interested Date:{" "}
              {selectedUser.interestedDate
                ? new Date(selectedUser.interestedDate).toLocaleDateString()
                : "N/A"}
            </p>
            <button className="close-button" onClick={handleModalClose}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterestedUsersList;
