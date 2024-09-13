import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import "../../Css/UserProfile.css";
import ClientPanel from "../UserPages/ClientPanel.jsx";
import PropertyList from "../OwnerPages/ManageProps.jsx";
import Modal from "../Modal.jsx";
import { FaUserEdit } from "react-icons/fa";
import ManageAllUsers from "../AdminPages/ManageAllUsers.jsx";
import ManageAllProps from "../AdminPages/ManageAllProps.jsx";
import InterestedUsersList from "../OwnerPages/InterestedUsersList.jsx";
import ApprovedInterest from "./ApprovedInterest.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const UserProfile = () => {
  const token = localStorage.getItem("userToken");

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPhone, setUpdatedPhone] = useState("");
  const [updatedFrgtKey, setUpdatedFrgtKey] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          setError("No authentication token found. Please log in.");
          dispatch(logout());
          navigate("/user/login");
          return;
        }

        const response = await axios.get("/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setUserType(response.data.userType);
        console.log("User Type:", response.data.userType); // Debug line
      } catch (err) {
        console.error(err);
        const errorMessage =
          err.response?.data?.message ||
          "Failed to fetch user data. Please log in again.";
        setError(errorMessage);
        dispatch(logout());
        navigate("/user/login");
      }
    };

    fetchUserData();
  }, [dispatch, navigate, token]);

  const handleUpdate = () => {
    setUpdatedName(user?.name || "");
    setUpdatedPhone(user?.phone || "");
    setUpdatedFrgtKey(user?.frgtKey || "");
    setIsModalOpen(true);
  };

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsPasswordModalOpen(false);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(
        "/api/v1/user/profile/update-profile",
        { name: updatedName, phone: updatedPhone, frgtKey: updatedFrgtKey },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await axios.get("/api/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      handleModalClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update user details.");
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      await axios.put(
        "/api/v1/user/profile/update-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      handleModalClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update password.");
    }
  };

  if (!isLoggedIn) {
    navigate("/user/login");
    return null;
  }

  return (
    <div className="ProfileContainer">
      <div className="ProfileSection">
        {error && <div className="error-message">{error}</div>}
        {user ? (
          <div className="UserDetailContainer">
            <h2>User Profile</h2>
            <div className="profile-image-container">
              <img src={user.profile} alt="Profile" className="profile-image" />
            </div>
            <div className="userDetails">
              <div className="userDetail">
                <span className="userDetailLabel">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="userDetail">
                <span className="userDetailLabel">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="userDetail">
                <span className="userDetailLabel">Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className="userDetail">
                <span className="userDetailLabel">User Type:</span>
                <span>{user.userType}</span>
              </div>
              <div className="userDetail">
                <span className="userDetailLabel">Profile Created At:</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="buttons">
              <button className="update-btn" onClick={handleUpdate}>
                <FaUserEdit />
                Update
              </button>
              <button
                className="reset-password-btn"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Conditional rendering based on userType */}
      {userType === "admin" && (
        <div className="ManagementSection">
          <div>
            <ManageAllProps />
          </div>
          <div>
            <ManageAllUsers />
          </div>
        </div>
      )}
      {userType === "owner" && (
        <div className="ManagementSection">
          <div>
            <PropertyList />
          </div>
          <div>
            <InterestedUsersList />
          </div>
        </div>
      )}
      {userType === "client" && (
        <div className="ManagementSection">
          <div>
            <ClientPanel />
          </div>
          <div>
            <ApprovedInterest />
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="user-update-form">
          <h3>Update User Details</h3>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              value={updatedPhone}
              onChange={(e) => setUpdatedPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="frgtKey">Your Password Reset Token:</label>
            <input
              type="text"
              id="frgtKey"
              value={updatedFrgtKey}
              onChange={(e) => setUpdatedFrgtKey(e.target.value)}
            />
          </div>
          <div className="modal-buttons">
            <button onClick={handleUpdateUser}>Save</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isPasswordModalOpen} onClose={handleModalClose}>
        <div className="user-update-form">
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="old-password">Old Password:</label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-buttons">
            <button onClick={handleChangePasswordSubmit}>
              Change Password
            </button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default UserProfile;
