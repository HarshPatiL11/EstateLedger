import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../../CSS/BecomeOwner.css"; 
import { logout } from "../../Redux/AuthSlice"; // Import the logout action

const BecomeOwner = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      dispatch(logout());
      navigate("/user/login");
      return; // Ensure no further code runs
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.userType !== "client") {
          toast.error("You do not have permission to access this page.");
          navigate("/");
          return;
        }

        setUser(response.data);
      } catch (error) {
        console.log(error);

        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch user profile. Please log in again.";
        setError(errorMessage);
        dispatch(logout());
        navigate("/user/login");
      }
    };

    fetchUserData();
  }, [token, dispatch, navigate]);

  const handleBecomeOwner = async () => {
    try {
      const response = await axios.put(
        "/api/v1/user/profile/become-owner",
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message, { autoClose: 2700 });
      setTimeout(() => {
        navigate("/owner/property/add");
      }, 3000); // 3-second delay
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!isLoggedIn) {
    navigate("/user/login");
    return null;
  }

  return (
    <div className="BO-form-container">
      <div className="BO-form-content">
        {error && <div className="error-message">{error}</div>}
        <h1 className="BO-form-title">Become an Owner</h1>
        <p className="BO-form-text">
          By clicking the button below, you agree to change your user type to
          "owner". This action is irreversible and will grant you new
          permissions.
        </p>
        <button className="BO-form-button" onClick={handleBecomeOwner}>
          Become Owner
        </button>
      </div>
    </div>
  );
};

export default BecomeOwner;
