import React, { useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import "../CSS/Navbar.css";

const Navbar = () => {
  const navbar = useRef();
  const [hamburger, setHamburger] = useState(false);

  function onMenuClick() {
    navbar.current.classList.toggle("responsive");
    setHamburger(!hamburger);
  }

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
        <a href="#">Leash/Sell</a>
        <a href="#">Buy/Rent</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Login</a>
      </div>
    </div>
  );
};

export default Navbar;
