/** @format */

import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../CSS/contact.css";
import { toast, ToastContainer } from "react-toastify";
 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    toast.success("Form submitted!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="Contact-container">
      <h1>Contact Us</h1>

      <div className="Contact-content">
        <section className="Contact-details">
          <h2>Our Contact Information</h2>
          <div className="Contact-item">
            <FaPhoneAlt className="icon" />
            <div>
              <strong>Phone:</strong> +1 (123) 456-7890
            </div>
          </div>
          <div className="Contact-item">
            <FaEnvelope className="icon" />
            <div>
              <strong>Email:</strong> support@esledrealestate.com
            </div>
          </div>
          <div className="Contact-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <strong>Address:</strong> 123 Main Street, Anytown, USA
            </div>
          </div>
        </section>

        <section className="Contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
