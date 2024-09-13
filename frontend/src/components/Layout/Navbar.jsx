import React, { useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Nav2.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/AuthSlice.js"; 
import { FaUser } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const navbar = useRef();
  const [hamburger, setHamburger] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  function onMenuClick() {
    navbar.current.classList.toggle("responsive");
    setHamburger(!hamburger);
  }

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
    <div className="page-header">
      <div className="logo">
        <Link to="/">
          <p className="LogoP">EsLed</p>
        </Link>
      </div>
      <a id="menu-icon" className="menu-icon" onClick={onMenuClick}>
        {hamburger ? <GrClose size={30} /> : <GiHamburgerMenu size={30} />}
      </a>

      <div id="navigation-bar" className="nav-bar" ref={navbar}>
        <Link to="/properties/Buy">Buy</Link>
        <Link to={"/properties/Rent"}>Rent</Link>
        <Link to={"/owner/property/add"}>Lease/Sell</Link>
        <Link to={"/about"}>About</Link>
        <Link to={"/contact-us"}>Contact</Link>
        {isLoggedIn ? (
          <>
            <Link to="/user/profile">
              <FaUser style={{ marginRight: "5px" }} />
              Profile
            </Link>
            <Link onClick={handleLogout}>Logout</Link>
          </>
        ) : // Conditionally render Login or Sign-up based on the current path
        location.pathname === "/user/login" ? (
          <Link to="/user/register">
            <FaUser style={{ marginRight: "5px" }} />
            Sign-up
          </Link>
        ) : (
          <Link to="/user/login">
            <FaUser style={{ marginRight: "5px" }} />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
