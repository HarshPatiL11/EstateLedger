import React, { useState } from "react";
import "../../CSS/Login2.css"; // Import your CSS file here
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
 

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      console.log(response.data);
      const { token } = response.data;
      localStorage.setItem("userToken", token);
      toast.success("Registration successful!");
      setSuccess("Login successful!");
      dispatch(login()); // Assuming 'login' action updates the global state
      navigate("/");
    } catch (error) {
      setError("Login failed! Please check your credentials.");
      console.error(error);
       toast.error("User Login failed! Please try again.");
    }
  };

  return (
    <div>
      <div className="Login-Bg"></div>
      <div className="Login-overlay"></div>
      <div className="loginContent">
        <div className="Login-header">
          <div>
            <span>Es</span>
            <span>Led</span>
          </div>
        </div>
        <div className="login">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              required
            />
            <input type="submit" value="Login" />
          </form>
          <p className="signup-link">
            Don't have an account? <Link to="/user/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
