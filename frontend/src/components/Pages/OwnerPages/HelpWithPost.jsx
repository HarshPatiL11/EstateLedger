/** @format */

import React, { useState } from "react";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import "../CSS/sell.css"; // Update CSS file accordingly
import { ToastContainer } from "react-toastify";

const HelpWithPost = () => {
  const [showFAQs, setShowFAQs] = useState(false);

  const toggleFAQs = () => {
    setShowFAQs(!showFAQs);
  };

  return (
    <div className="sell-Main">
      <div className="App-info">
        <h1>Welcome to EsLed Online Real-Estates</h1>

        <section className="Info">
          <h2>How to Sell a Property</h2>
          <ol>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Sign Up:</strong> Create an account using your email
              address and phone number.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Login:</strong> Access your account using your
              credentials.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Click on the "Post Property" Button:</strong> Navigate to
              the home page and click the "Post Property" button.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Add Property Details:</strong> Fill in all required
              details about your property and submit the listing.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Await User Interactions:</strong> Monitor responses from
              potential buyers.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Review Interest Notifications:</strong> When a buyer shows
              interest by clicking the "Interest" button, you will be notified
              and able to see their contact information.
            </li>
            <li>
              <FaCheckCircle className="icon" />
              <strong>Finalize the Deal:</strong> Once you agree on the terms
              with a buyer, finalize the sale as per the instructions provided
              through the app.
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
                <strong>How do I post a property?</strong> <br />
                Click on the "Post Property" button on the home page and follow
                the prompts to enter your property details.
              </li>
              <li>
                <strong>Can I edit my property listing?</strong> <br />
                Yes, you can edit your listing by accessing your account and
                modifying the property details.
              </li>
              <li>
                <strong>How do I communicate with potential buyers?</strong>{" "}
                <br />
                Use the messaging feature in the app to interact with interested
                buyers.
              </li>
              <li>
                <strong>What if I need help with the sale process?</strong>{" "}
                <br />
                Contact our support team through the app for assistance with the
                selling process.
              </li>
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default HelpWithPost;
