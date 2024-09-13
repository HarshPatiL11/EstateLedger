import React from "react";
import "../CSS/Footer2.css";

const Footer2 = () => {
  return (
    <footer className="footer">
      <ul className="footer-social-icons">
        <li>
          <a
            className="fab fa-instagram"
            href="https://www.instagram.com/"
            aria-label="Instagram"
          ></a>
        </li>
        <li>
          <a
            className="fab fa-youtube"
            href="https://www.youtube.com/@recklet"
            aria-label="YouTube"
          ></a>
        </li>
        <li>
          <a
            className="fab fa-facebook-f"
            href="https://www.facebook.com/"
            aria-label="Facebook"
          ></a>
        </li>
        <li>
          <a
            className="fab fa-telegram"
            href="https://telegram.me/"
            aria-label="Telegram"
          ></a>
        </li>
      </ul>

      <ul className="footer-menu">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About Us</a>
        </li>
        <li>
          <a href="#">Privacy Policy</a>
        </li>
        <li>
          <a href="#">Terms & Conditions</a>
        </li>
      </ul>

      <p>Ⓒ2023 EsLed Developer | All Rights Reserved</p>
    </footer>
  );
};

export default Footer2;
