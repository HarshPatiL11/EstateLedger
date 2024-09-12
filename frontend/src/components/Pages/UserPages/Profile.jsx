import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../Redux/AuthSlice.js";
import { useNavigate } from "react-router-dom";
// import "../../Css/UserProfile.css";
import AdminPanel from "../AdminPanel.jsx";
import ClientPanel from "../UserPages/ClientPanel.jsx";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
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
  }, [dispatch, navigate]);

  const handleUpdate = () => {
    navigate("/user/update");
  };

  const handleChangePassword = () => {
    navigate("/user/changepassword");
  };

  const renderUserPanel = () => {
    if (!user) return null;

    switch (user.userType) {
      case "admin":
        return <AdminPanel />;
      case "client":
        return <ClientPanel />;
      default:
        return <p>Access Denied</p>;
    }
  };

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    navigate("/user/login");

    return null;
  }

  return (
    <div className="ProfileSection">
      {error && <div className="error-message">{error}</div>}
      {user ? (
        <div className="UserDetailContainer">
          <h2>User Profile</h2>
          <img src={user.profile} alt="Profile" className="profile-image" />
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
              Update
            </button>
            <button
              className="reset-password-btn"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
          {renderUserPanel()}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
