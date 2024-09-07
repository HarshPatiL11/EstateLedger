import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PropertyById = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`api/v1/property/${id}`);
        console.log(response.data.propertiesWithImg);
        
        setProperty(response.data.propertiesWithImg); // Ensure this matches the response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading property data.</div>;

  return (
    <div>
      <h1>Property Details</h1>
      {property && (
        <div>
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
            <div>
              <h3>Property Images</h3>
              {property.propertyImg.map((img, index) => (
                <img
                  key={index}
                  src={`data:${img.contentType};base64,${Buffer.from(
                    img.data
                  ).toString("base64")}`}
                  alt={`Property Image ${index + 1}`}
                  style={{ maxWidth: "100%", height: "auto" }}
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
