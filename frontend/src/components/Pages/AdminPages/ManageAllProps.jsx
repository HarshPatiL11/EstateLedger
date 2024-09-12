import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt, FaTrash, FaCheck, FaCheckCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import "../../CSS/PropertyList.css";
import Modal from "../Modal";
import PropertyUpdatePage from "../OwnerPages/UpdatePropsPage";
import { logout } from "../../Redux/AuthSlice";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const ManageAllProps = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!isLoggedIn) {
          toast.warning("Please log in.");
          setError("Please log in.");
          dispatch(logout());
          navigate("/user/login");
          return;
        }
        if (!token) {
          toast.warning("No authentication token found. Please log in.");
          setError("No authentication token found. Please log in.");
          dispatch(logout());
          navigate("/user/login");
          return;
        }
      } catch (err) {
        console.error(err);
        const errorMessage =
          err.response?.data?.message ||
          "Failed to fetch user data. Please log in again.";
        toast.error(errorMessage);
        setError(errorMessage);
        dispatch(logout());
        navigate("/user/login");
      }
    };

    fetchUserData();
  }, [dispatch, navigate, isLoggedIn]);

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/v1/admin/property/get/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties(response.data.propertiesWithImg);
        console.log("API Response:", response.data);
        if (response.data.propertiesWithImg.length === 0) {
          toast.info("No properties available.");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error(`Error fetching properties: ${error.message}`);
        setError(`Error fetching properties: ${error.message}`);
      }
    };

    fetchProperties();
  }, [token]);

  const handleUpdate = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = (propertyId) => {
    axios
      .delete(`/api/v1/admin/delete-property/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setProperties(
            properties.filter((property) => property._id !== propertyId)
          );
          toast.success("Property deleted successfully!");
        } else {
          console.error("Failed to delete property:", response.data.message);
          toast.error(`Failed to delete property: ${response.data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting property:", error);
        toast.error(`Error deleting property: ${error.message}`);
      });
  };

  const handleApprove = (propertyId) => {
    axios
      .put(
        `/api/v1/admin/property/approve/${propertyId}`,
        {}, // Request body should be empty for this operation
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setProperties(
            properties.map((property) =>
              property._id === propertyId
                ? { ...property, isApproved: true }
                : property
            )
          );
          toast.success("Property approved successfully!");
        } else {
          console.error("Failed to approve property:", response.data.message);
          toast.error(`Failed to approve property: ${response.data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error approving property:", error);
        toast.error(`Error approving property: ${error.message}`);
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
          {properties.map((property) => (
            <tr key={property._id}>
              <td>{property.owner}</td>
              <td>
                {property.project}
                {property.isApproved && (
                  <MdVerified
                    style={{
                      color: "green",
                      fontSize: "1.5em",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </td>
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
                <button
                  className="action-button"
                  onClick={() => handleApprove(property._id)}
                >
                  {property.isApproved ? (
                    <FaCheckCircle style={{ color: "green" }} />
                  ) : (
                    <FaCheck />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PropertyUpdatePage
          property={selectedProperty}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(updatedProperty) => {
            setProperties(
              properties.map((prop) =>
                prop._id === updatedProperty._id ? updatedProperty : prop
              )
            );
            setIsModalOpen(false);
            toast.success("Property updated successfully!");
          }}
        />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ManageAllProps;
