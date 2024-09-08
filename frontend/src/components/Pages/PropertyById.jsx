import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../CSS/PropertyById.css'

const PropertyById = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Logging id 1st time getId ", id);

  useEffect(() => {
    const fetchProperty = async () => {
      console.log("Logging id in fetch Prop ", id);

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/property/${id}`
        );
        console.log(response.data.propertyWithImg);

        setProperty(response.data.propertyWithImg); // Ensure this matches the response structure
        setLoading(false);
        console.log("Success fetched Prop ", id, property);
      } catch (error) {
        console.error("Error fetching property data:", error);
        setError(error);
        setLoading(false);
        console.log("errror in fetched Prop ", id);
      }
    };

    fetchProperty();
  }, [id, property]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error loading property data.</div>;

  return (
    <div className="property-details-container">
      <h1>Property Details</h1>
      {property && (
        <div className="property-details">
          <p>
            <strong>Address:</strong> {property.address}
          </p>
          <p>
            <strong>Age of Construction:</strong> {property.ageOfConstruction}
          </p>
          <p>
            <strong>Carpet Area:</strong> {property.carpetarea} sq.ft.
          </p>
          <p>
            <strong>Developer:</strong> {property.developer}
          </p>
          <p>
            <strong>Electricity Status:</strong> {property.electricityStatus}
          </p>
          <p>
            <strong>Facing:</strong> {property.facing}
          </p>
          <p>
            <strong>Flooring:</strong> {property.flooring.join(", ")}
          </p>
          <p>
            <strong>Furnishing:</strong> {property.furnishing}
          </p>
          <p>
            <strong>Floor:</strong> {property.floor}
          </p>
          <p>
            <strong>Lifts:</strong> {property.lifts}
          </p>
          <p>
            <strong>Location:</strong> {property.location}
          </p>
          <p>
            <strong>Landmarks:</strong> {property.landmarks}
          </p>
          <p>
            <strong>Layout:</strong> {property.layout}
          </p>
          <p>
            <strong>Ownership Type:</strong> {property.ownershipType}
          </p>
          <p>
            <strong>Overlooking:</strong> {property.overlooking.join(", ")}
          </p>
          <p>
            <strong>Price Breakup:</strong> {property.priceBreakup}
          </p>
          <p>
            <strong>Price Per Sqft:</strong> {property.pricePerSqft}
          </p>
          <p>
            <strong>Property Class:</strong> {property.propClass}
          </p>
          <p>
            <strong>Project:</strong> {property.project}
          </p>
          <p>
            <strong>Sell Start Price:</strong> {property.SellStartprice}
          </p>
          <p>
            <strong>Status:</strong> {property.status}
          </p>
          <p>
            <strong>Total Floors:</strong> {property.totalFloors}
          </p>
          <p>
            <strong>Transaction Type:</strong> {property.transactionType}
          </p>
          <p>
            <strong>Water Availability:</strong> {property.waterAvailability}
          </p>
          <p>
            <strong>Sell or Lease:</strong> {property.sellOrLease}
          </p>
          {property.rentAmount && (
            <>
              <p>
                <strong>Rent Amount:</strong> {property.rentAmount}
              </p>
              <p>
                <strong>Rent Frequency:</strong> {property.rentFrequency}
              </p>
            </>
          )}
          {/* Display property images if available */}
          {property.propertyImg && property.propertyImg.length > 0 && (
            <div className="property-images">
              <h3>Property Images</h3>
              {property.propertyImg.map((img, index) => (
                <img
                  key={index}
                  src={img.data}
                  alt={`Property Image ${index + 1}`}
                  className="property-image"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyById;
