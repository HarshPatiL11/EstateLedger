import React from "react";
import "../CSS/Footer.css"; // Ensure the CSS file is in the same directory

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        Harsh patil &copy; {new Date().getFullYear()} . All rights reserved.
      </p>
      <p>Designed with love</p>
    </footer>
  );
};

export default Footer;
