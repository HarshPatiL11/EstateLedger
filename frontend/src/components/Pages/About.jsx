/** @format */

import React from "react";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import { useState } from "react";
import "../CSS/about.css";
import { ToastContainer } from "react-toastify";

const About = () => {
  const [showFAQs, setShowFAQs] = useState(false);

  const toggleFAQs = () => {
    setShowFAQs(!showFAQs);
  };

  return (
    <div className="about-Main">
      <div className="App-info">
        <h1>Welcome to EsLed Online Real-Estates</h1>

        <section className="Info">
          <h2>How to Buy or Rent a Property</h2>
          <ol>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Create an Account:</strong> Sign up using your email
              address and phone number.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Search for Properties:</strong> Use the app to find
              available properties that match your criteria.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Contact the Seller/Owner:</strong> Reach out to the
              property owner through the app to schedule a visit or get more
              details.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Finalize the Deal:</strong> Complete the purchase or
              rental process as per the instructions provided by the
              seller/owner.
            </li>
          </ol>
        </section>

        <section className="faqs">
          <h2 onClick={toggleFAQs} className="faq-title">
            Frequently Asked Questions <FaQuestionCircle className="icon" />
          </h2>
          {showFAQs && (
            <ul>
              <li>
                <strong>How do I view property details?</strong> <br />
                Click on the property listing to view detailed information,
                including photos, price, and contact details.
              </li>
              <li>
                <strong>Can I schedule a property visit?</strong> <br />
                Yes, use the contact options provided in the property listing to
                arrange a visit with the owner.
              </li>
              <li>
                <strong>What payment methods are accepted?</strong> <br />
                Payment methods vary by property. Check the listing or contact
                the owner for specific payment options.
              </li>
              <li>
                <strong>What if I have issues with a property?</strong> <br />
                Contact our support team through the app for assistance with any
                issues or concerns regarding a property.
              </li>
            </ul>
          )}
        </section>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default About;
