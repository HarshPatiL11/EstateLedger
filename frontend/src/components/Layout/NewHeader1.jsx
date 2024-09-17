import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../CSS/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/AuthSlice.js";
import { FaUser, FaAngleDown } from "react-icons/fa";
import axios from "axios";

const NewHeader1 = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("User logged out successfully.");
      localStorage.removeItem("userToken");
    } catch (err) {
      console.error(err);
    }

    dispatch(logout());
    navigate("/user/login");
  };

  return (
    <div className="navbar-nav1">
      <div className="nav1-container">
        <div className="logo-nav1">
          <Link to="/">
            <p>esled</p>
          </Link>
        </div>

        <div className="nav-bar-nav1">
          {isLoggedIn ? (
            <>
              <Link to="/user/profile">
                <FaUser style={{ marginRight: "5px" }} />
                Profile
              </Link>
              <Link onClick={handleLogout}>Logout</Link>
            </>
          ) : location.pathname === "/user/login" ? (
            <Link to="/user/register">
              <FaUser style={{ marginRight: "5px" }} />
              Sign-up
            </Link>
          ) : (
            <Link to="/user/login" className="login-a">
              Login{" "}
              <span>
                <FaAngleDown />
              </span>
            </Link>
          )}
          <div className="post-property-btn-nav1">
            <Link to={"user/become-seller"}>
              <label>
                Post Property <span>FREE</span>
              </label>
            </Link>
          </div>
        </div>
      </div>
      <div className="nav2-container">
        <div className="nav2-header">
          <ul className="nav2-menu">
            <li className="nav2-menu-option">
              <Link to="/properties/Buy">Buy</Link>
            </li>
            <li className="nav2-menu-option">
              <Link to="/properties/Rent">Rent</Link>
            </li>
            <li className="nav2-menu-option">
              <Link to="/owner/property/add">Sell</Link>
            </li>
            <li className="nav2-menu-option">
              <Link to="/help-sell">Post?</Link>
            </li>
            <li className="nav2-menu-option">
              <Link to="/help-buy">Buy?</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewHeader1;
