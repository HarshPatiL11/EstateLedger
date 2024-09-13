import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/PropertyList.css"; // Reuse the same CSS for consistent styling
import { MdVerified } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import Modal from "../Modal"; // Assuming you have a Modal component

const ApprovedInterest = () => {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const response = await axios.get(
          `/api/v1/user/profile/properties/interest/approved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.approvedProjects) {
          setApprovedProjects(response.data.approvedProjects);
        } else {
          setError("No approved properties found.");
        }
      } catch (error) {
        setError("Error fetching approved properties.");
        console.error("Error fetching approved properties:", error);
      }
    };

    fetchApprovedProjects();
  }, [token]);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const calculateDeposit = (project) => {
    if (project.propertyDetails.sellOrLease === "Sell") {
      return (project.propertyDetails.SellStartprice * 0.1).toFixed(2); // 10% of selling price
    }
    if (project.propertyDetails.sellOrLease === "Lease") {
      return (project.propertyDetails.rentAmount * 4).toFixed(2); // 4 times rent amount
    }
    return "N/A";
  };

  return (
    <div className="property-list">
      <h1>Approved Properties List</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="property-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Date of Approval</th>
            <th>Selling Price</th>
            <th>Rent Amt</th>
            <th>Approved</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(approvedProjects) && approvedProjects.length > 0 ? (
            approvedProjects.map((interest, index) => (
              <tr key={index}>
                <td>{interest.propertyDetails.project || "N/A"}</td>
                <td>
                  {new Date(interest.approvedDate).toLocaleDateString() ||
                    "N/A"}
                </td>
                <td>{interest.propertyDetails.SellStartprice || "N/A"}</td>
                <td>
                  {interest.propertyDetails.sellOrLease === "Lease" ||
                  interest.propertyDetails.sellOrLease === "Both"
                    ? interest.propertyDetails.rentAmount || "N/A"
                    : "N/A"}
                </td>
                <td>{interest.isApprove ? <MdVerified /> : "N/A"}</td>
                <td>
                  <FaInfoCircle
                    style={{ cursor: "pointer" }}
                    onClick={() => handleViewDetails(interest)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No approved properties found</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && selectedProject && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <div className="user-confirm-form">
            <h2>Confirmation Details</h2>
            <p>
              Confirm by{" "}
              {new Date(
                new Date(selectedProject.approvedDate).getTime() +
                  5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}{" "}
              (Within 5days of Approval)
            </p>
            <p>First Deposit: {calculateDeposit(selectedProject)}</p>
            <button onClick={handleModalClose}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApprovedInterest;
