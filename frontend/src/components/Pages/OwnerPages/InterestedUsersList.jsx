import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/PropertyList.css"; // Reuse the same CSS file for consistent styling
import Modal from "../Modal"; // Import the Modal component
import { FaEye } from "react-icons/fa"; // Use a suitable icon for viewing details
import { MdVerified } from "react-icons/md"; // Verified icon
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

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
          toast.success("Interested users loaded successfully!");
        } else {
          setError("Failed to fetch interested users.");
          toast.error("Failed to fetch interested users.");
          console.error(response.data.message);
        }
      } catch (error) {
        setError("Error fetching interested users data.");
        toast.error("Error fetching interested users.");
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

  const handleApproveUser = async (interestedId) => {
    console.log("Approving user with ID:", interestedId); // Log the ID
    try {
      const response = await axios.put(
        `/api/v1/owner/interested/user/${interestedId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setInterestedUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === interestedId ? { ...user, isApprove: true } : user
          )
        );
        toast.success("User approved successfully!");
      } else {
        toast.error("Failed to approve user.");
        console.error("Failed to approve user:", response.data.message);
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Error approving user.");
    }
  };

  return (
    <div className="property-list">
      <ToastContainer /> 
      <h1>Interested Users List</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="property-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Property Project</th>
            <th>Interested Date</th>
            <th>Approved</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(interestedUsers) && interestedUsers.length > 0 ? (
            interestedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name || "N/A"}</td>
                <td>{user.projectName || "N/A"}</td>
                <td>
                  {user.interestedDate
                    ? new Date(user.interestedDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{user.isApprove ? <MdVerified /> : "Pending"}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleViewDetails(user)}
                  >
                    <FaEye /> View Details
                  </button>
                  {!user.isApprove && (
                    <button
                      className="approve-button"
                      onClick={() => handleApproveUser(user._id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No interested users found</td>
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

            {selectedUser.isApprove ? (
              <p>
                Approved Date:{" "}
                {selectedUser.approvedDate
                  ? new Date(selectedUser.approvedDate).toLocaleDateString()
                  : "N/A"}
              </p>
            ) : null}
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
