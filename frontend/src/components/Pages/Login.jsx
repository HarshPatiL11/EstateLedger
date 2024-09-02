import React, { useState } from "react";
import "../CSS/Login.css"; // Make sure the path is correct
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { login } from "../Redux/AuthSlice";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

//   const dispatch = useDispatch();
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
      const response = await axios.post("/user/login", {
        email: formData.userEmail,
        password: formData.userPassword,
      });
      console.log(response.data);
      const { token } = response.data;
      localStorage.setItem("userToken", token);
      setSuccess("Login successful!");
    //   dispatch(login()); // Assuming 'login' action updates the global state
      navigate("/");
    } catch (error) {
      setError("Login failed! Please check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="LoginMain">
      <div className="Login-Body">
        <div className="Login-Img">
          {/* Add background image or other content here */}
        </div>
        <div className="LoginForm">
          <h2>Login</h2>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Id</label>
              <input
                type="email"
                id="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
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
          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
