import React, { useState } from "react";
import axios from "axios";
import "../../CSS/UserRegister.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
 

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

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
    setError("");
    setSuccess(null);

    try {
      await axios.post("/api/v1/user/register", formData);
      toast.success("Registration successful!");
      setSuccess("Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      navigate("/user/login");
    } catch (error) {
      if (
        error.response.status === 400 &&
        error.response.data === "Email already registered"
      ) {
        // Display toast message and redirect to login page
        toast.info("Email already in use. Redirecting...", {
          autoClose: 1600, // Set autoClose duration to 2 seconds (2000 milliseconds)
        });
        setTimeout(() => {
          navigate(`/user/login?email=${encodeURIComponent(formData.email)}`);
        }, 2010);
      } else {
        console.error("Registration failed:", error.response.data);
        setError(error.response.data);
        toast.error("Registration failed! Please try again.");
      }
    }
  };

  return (
    <>
    <ToastContainer/>
      <div className="registerbody">
        <div className="register-container">
          <div className="register-glass-card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {success && <p className="success-message">{success}</p>}
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="register-btn">
                Register
              </button>
            </form>
            <p className="signup-link">
              Already have an account? <Link to={"/user/login"}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRegister;
