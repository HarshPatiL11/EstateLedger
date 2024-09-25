import React, { useState, useEffect } from "react";
import "../../CSS/Login3.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/AuthSlice";
import { toast, ToastContainer } from "react-toastify";

const LoginPageB = () => {
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
    // Extract email and password from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const password = queryParams.get("newPassword");

    if (email) {
      setFormData((prev) => ({ ...prev, userEmail: email }));
    }
    if (password) {
      setFormData((prev) => ({ ...prev, userPassword: password }));
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
      console.log(response.data);
      const { token } = response.data;
      localStorage.setItem("userToken", token);
      toast.success("Login successful!");
      setSuccess("Login successful!");
      dispatch(login());
      navigate("/");
    } catch (error) {
      setError("Login failed! Please check your credentials.");
      console.error(error);
      toast.error("User Login failed! Please try again.");
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
                <span>Es</span>
                <span>Led</span>
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
            <div className="signup-link">
              <p className="">
                Don't have an account? <Link to="/user/register">Sign up</Link>
              </p>
              <p className="">
                Forgot password? <Link to="/user/forgetpassword">Here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPageB;
