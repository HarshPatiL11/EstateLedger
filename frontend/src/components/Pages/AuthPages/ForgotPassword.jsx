import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
 
import "../../CSS/ForgotPass.css";
import "../../CSS/Login3.css"; // Reusing the existing CSS
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    frgtKey: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Added missing parentheses to useNavigate hook

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
    console.log(
      "frontend log of formdata:-",
      formData.newPassword,
      formData.email,
      formData.frgtKey
    );
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.put(`/api/v1/user/resetpassword`, {
        email: formData.email,
        frgtKey: formData.frgtKey,
        newPassword: formData.newPassword,
      });
      toast.success(response.data.message);

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate(
          `/user/login?email=${encodeURIComponent(
            formData.email
          )}&newPassword=${encodeURIComponent(formData.newPassword)}`
        );
      }, 1010);
    } catch (error) {
      setError(error.response?.data.message || "Error resetting password");
      toast.error(error.response?.data.message || "Error resetting password");
    }
  };

  return (
    <>
      <div className="ForgotPasswordBody">
        <div className="ForgotPassword-container">
          <div className="ForgotPassword-glass-card">
            <div className="ForgotPassword-header">
              <div>
                <span>Reset</span>
                <span>Password</span>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Reset Key"
                  name="frgtKey"
                  value={formData.frgtKey}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="login-btn">
                Reset Password
              </button>
            </form>
            <div className="signup-link">
              <p className="">
                Remembered password? <Link to="/user/login">Here</Link>
              </p>
            </div>
          </div>
        </div>
        <ToastContainer/>
      </div>
    </>
  );
};

export default ForgotPassword;
