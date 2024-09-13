import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/PropertyList.css"; // Reuse the same CSS for consistent styling
import { MdVerified } from "react-icons/md";

const ApprovedInterest = () => {
  const [approvedProjects, setApprovedProjects] = useState([]);
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No approved properties found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedInterest;
