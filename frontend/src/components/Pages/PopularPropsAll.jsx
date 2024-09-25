import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/PopularPropsAll.css";
import Card from "./Card.jsx";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
 

const PopularProps = () => {
  const [popCards, setPopCards] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/v1/property/all");

        console.log("API Response:", response.data); // Log the entire response
        if (response.data && response.data.propertiesWithImg) {
          setPopCards(response.data.propertiesWithImg);
        } else {
          throw new Error("Unexpected data structure");
        }
      } catch (error) {
        console.error("Error fetching properties:", error); // Log the full error
        setError(`Error fetching properties: ${error.message}`);
      }
    };

    fetchProperties();
  }, []);

  const handleView = (property) => {
    console.log("Navigating to Property with ID:", property._id);
    navigate(`/properties/get/${property._id}`);
  };


  const formatAmount = (amount) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)} cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)} lac`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)} k`;
    } else {
      return amount.toString();
    }
  };


  return (
    <div className="popular-props-container">
      <div className="popular-props-content">
        <div className="popular-props-header">
          <h2>All Properties</h2>
        </div>
        {error && <p className="popular-props-error">{error}</p>}
        <div className="popular-props-cards">
          {popCards.map((property) => {
            const amount =
              property.sellOrLease === "Sell" || property.sellOrLease === "both"
                ? property.SellStartprice
                : property.rentAmount;
            const formattedAmount = formatAmount(amount);

            return (
              <Card
                key={property._id}
                layout={property.layout}
                type={property.propClass}
                imageNum={property.propertyImg.length}
                amount={formattedAmount}
                carpetArea={property.carpetarea}
                location={property.location}
                status={property.status}
                image={property.propertyImg[0]?.data}
                onClick={() => handleView(property)}
              />
            );
          })}
          
        </div>
      </div>
    </div>
  );
};

export default PopularProps;
