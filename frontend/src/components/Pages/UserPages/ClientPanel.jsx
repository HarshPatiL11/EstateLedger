import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/PropertyList.css"; // Reuse the same CSS for consistent styling

const ClientPanel = () => {
  const [interestedProjects, setInterestedProjects] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchInterestedProjects = async () => {
      try {
        const response = await axios.get(
          `/api/v1/user/profile/interested/properties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.interestedProjects) {
          setInterestedProjects(response.data.interestedProjects);
        } else {
          setError("No interested properties found.");
        }
      } catch (error) {
        setError("Error fetching interested properties.");
        console.error("Error fetching interested properties:", error);
      }
    };

    fetchInterestedProjects();
  }, [token]); // Remove userId from dependency array, as it is fetched internally

  return (
    <div className="property-list">
      <h1>Interested Properties List</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="property-table">
        <thead>
          <tr>
            <th>Project Name</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(interestedProjects) &&
          interestedProjects.length > 0 ? (
            interestedProjects.map((property, index) => (
              <tr key={index}>
                <td>{property.project || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="1">No interested properties found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientPanel;
