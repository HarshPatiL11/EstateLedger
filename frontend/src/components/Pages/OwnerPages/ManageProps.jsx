import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../Table"; // Adjust the path according to your structure

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    // Fetching property data from API using axios
    axios
      .get("/api/v1/owner/property/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Access properties from response.data
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          console.error("Failed to fetch properties:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching property data:", error);
      });
  }, [token]);

  return (
    <div>
      <h1>Property Listings</h1>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Owner</th>
            <th>Project</th>
            <th>Carpet Area (sqft)</th>
            <th>Selling Price (₹)</th>
            <th>Rent Amount (₹)</th>
            <th>Sell or Lease</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <Table
              key={index}
              owner={property.owner}
              project={property.project}
              carpetarea={property.carpetarea}
              SellStartprice={property.SellStartprice}
              sellOrLease={property.sellOrLease}
              rentAmount={property.rentAmount}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyList;
