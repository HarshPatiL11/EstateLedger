import React, { useState, useEffect } from "react";
import "../../CSS/Login3.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
 

const ADMLogin = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    if (email) {
      setFormData((prev) => ({ ...prev, userEmail: email }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("/api/v1/user/login", {
        email: formData.userEmail,
        password: formData.userPassword,
      });

      console.log("Response data:", response.data); // For debugging

      if (response.data.user.userType === "admin") {
        const { token } = response.data;
        localStorage.setItem("userToken", token);
        toast.success("Login successful!");
        setSuccess("Login successful!");
        dispatch(login());
        navigate("/");
      } else {
        toast.error("Only Admin access allowed.");
        navigate("/user/login"); // Redirect non-admins
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Login failed! Please check your credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <>
    <ToastContainer/>
      <div className="LoginBody">
        <div className="Login-container">
          <div className="Login-glass-card">
            <div className="Login-header">
              <div>
                <span>ADMIN</span>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="userPassword"
                  value={formData.userPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ADMLogin;
