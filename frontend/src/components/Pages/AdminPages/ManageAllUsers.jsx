import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { GrUpgrade } from "react-icons/gr";
import { MdOutlineVerified, MdVerified } from "react-icons/md";
import "../../Css/UserProfile2.css"; // Reuse the same CSS
import Modal from "../Modal"; // Ensure this is the correct path
import { logout } from "../../Redux/AuthSlice";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"; // Import react-toastify

const ManageAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!isLoggedIn) {
          toast.error("Please log in.");
          setError("Please log in.");
          dispatch(logout());
          navigate("/user/login");
          return;
        }
        if (!token) {
          toast.error("Please log in.");

          setError(" Please log in.");
          dispatch(logout());
          navigate("/user/login");
          return;
        }
      } catch (err) {
        console.error(err);
        const errorMessage =
          err.response?.data?.message ||
          "Failed to fetch user data. Please log in again.";
        setError(errorMessage);
        toast.error("Please log in.");

        dispatch(logout());
        navigate("/user/login");
      }
    };

    fetchUserData();
  }, [dispatch, navigate, isLoggedIn]);

  const token = localStorage.getItem("userToken");


 useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("/api/v1/admin/users/get/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userType: filter }, // Include filter in query params
        });
        setUsers(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(`Error fetching users: ${error.message}`);
      }
    };

    fetchAllUsers();
  }, [token, filter]); // Add filter as dependency

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalContent(null);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.put(
        `/api/v1/admin/users/update/${selectedUser._id}`,
        { name: selectedUser.name, phone: selectedUser.phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await axios.get(
        `/api/v1/admin/users/get/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? response.data : user
        )
      );
      toast.success(`User Updated`);
      handleModalClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update user details.");
      toast.error(`Failed  to Update user Details`);
      handleModalClose();
    }
  };

const handleApproveUser = async () => {
  try {
    const response = await axios.put(
      `/api/v1/admin/users/approve/${selectedUser._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, approved: true } : user
        )
      );
      toast.success(`User Verified`);
      handleModalClose();
    } else {
      // Handle specific error message
      toast.error(
        response.data.message ||
          `Failed to Verify User, Check If User Is Verified`
      );
      handleModalClose();
    }
  } catch (error) {
    console.error("Error approving user:", error);
    toast.error(`Failed to Verify User, Check User Info`);
    handleModalClose();
  }
};

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setModalContent("update");
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setModalContent("delete");
    setIsModalOpen(true);
  };

  const handleUpgrade = (user) => {
    setSelectedUser(user);
    setModalContent("upgrade");
    setIsModalOpen(true);
  };

  const handleApprove = (user) => {
    setSelectedUser(user);
    setModalContent("approve");
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `/api/v1/admin/users/delete-account/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== selectedUser._id));
toast.success("User Deleted");
        handleModalClose();
      } else {
        console.error("Failed to delete user:", response.data.message);
        toast.error(`Failed to Delete User,Check User Info`);
        handleModalClose();
      }
    } catch (error) {
toast.error("failed to Delete User");

      console.error("Error deleting user:", error);
      toast.error(`Failed to Delete User`);
      handleModalClose();
    }
  };

  const handleUpgradeConfirm = async () => {
    try {
      const response = await axios.put(
        `/api/v1/admin/users/update-userType/${selectedUser._id}`,
        { userType: "owner" }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id
              ? { ...user, userType: "owner" }
              : user
          )
        );
        handleModalClose();
      } else {
        console.error("Failed to upgrade user:", response.data.message);
        toast.error(`Failed Upgrade ,Check User Info`);
        handleModalClose();
      }
    } catch (error) {
      console.error("Error upgrading user:", error);
      toast.error(`Failed Upgrade User`);
      handleModalClose();
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "update":
        return (
          <div className="user-update-form">
            <h3>Update User Details</h3>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={selectedUser?.name || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                value={selectedUser?.phone || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, phone: e.target.value })
                }
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleUpdateUser}>Save</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        );
      case "delete":
        return (
          <div className="user-update-form">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirm}>Yes, Delete</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        );
      case "upgrade":
        return (
          <div className="user-update-form">
            <h2>Upgrade User</h2>
            <p>Are you sure you want to upgrade this user to Owner?</p>
            <div className="modal-buttons">
              <button onClick={handleUpgradeConfirm}>Yes, Upgrade</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        );
      case "approve":
        return (
          <div className="user-update-form">
            <h2>Approve User</h2>
            <p>Are you sure you want to approve this user?</p>
            <div className="modal-buttons">
              <button onClick={handleApproveUser}>Yes, Approve</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="property-list">
      <h1>User Listings</h1>
      <div className="filter-container">
        <label htmlFor="filter">Filter by User Type:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="client">Client</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <table className="property-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Profile</th>
            <th>User Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {user.name}
                {user.approved && (
                  <MdVerified
                    style={{
                      color: "green",
                      fontSize: "1.5em",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <img
                  src={user.profile}
                  alt="profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              </td>
              <td>{user.userType}</td>
              <td>
                <button
                  className="action-button"
                  onClick={() => handleUpdate(user)}
                >
                  <FaPencilAlt />
                </button>
                <button
                  className="action-button"
                  onClick={() => handleDelete(user)}
                >
                  <FaTrash />
                </button>
                <button
                  className="action-button"
                  onClick={() => handleUpgrade(user)}
                >
                  <GrUpgrade />
                </button>
                <button
                  className="action-button"
                  onClick={() => handleApprove(user)}
                >
                  <MdOutlineVerified />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default ManageAllUsers;
