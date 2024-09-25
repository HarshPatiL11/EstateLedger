// PropertyList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import "../../CSS/PropertyList.css";
import Modal from "../Modal"; // Import the Modal component
import PropertyUpdatePage from "./UpdatePropsPage"; // Import the update page component
import { ToastContainer } from "react-toastify";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    axios
      .get("/api/v1/owner/property/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
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

  const handleUpdate = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

const handleDelete = (propertyId) => {
  console.log(propertyId);

  axios
    .delete(`/api/v1/owner/property/delete/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data.success) {
        setProperties(
          properties.filter((property) => property._id !== propertyId)
        );
      } else {
        console.error("Failed to delete property:", response.data.message);
      }
    })
    .catch((error) => {
      console.error("Error deleting property:", error);
    });
};

return (
  <div className="property-list">
    <h1>Property Listings</h1>
    <table className="property-table">
      <thead>
        <tr>
          <th>Owner</th>
          <th>Project</th>
          <th>Carpet Area (sqft)</th>
          <th>Selling Price (₹)</th>
          <th>Rent Amount (₹)</th>
          <th>Sell or Lease</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(properties) && properties.length > 0 ? (
          properties.map((property) => {
            console.log(property);
            return (
              <tr key={property._id}>
                <td>{property.owner}</td>
                <td>{property.project}</td>
                <td>{property.carpetarea}</td>
                <td>{property.SellStartprice}</td>
                <td>{property.rentAmount}</td>
                <td>{property.sellOrLease}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleUpdate(property)}
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleDelete(property._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="7">No properties found</td>
          </tr>
        )}
      </tbody>
    </table>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <PropertyUpdatePage
        property={selectedProperty}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(updatedProperty) => {
          setProperties(
            properties.map((prop) =>
              prop.id === updatedProperty.id ? updatedProperty : prop
            )
          );
          setIsModalOpen(false);
        }}
      />
    </Modal>
  </div>
);
};

export default PropertyList;
