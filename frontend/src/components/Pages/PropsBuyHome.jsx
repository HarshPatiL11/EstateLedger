import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/propsFilter.css";
import Card from "./Card"; // Ensure Card component is properly imported
import { useNavigate } from "react-router-dom";

const PropsBuy = () => {
  const [filters, setFilters] = useState({
    layout: "",
    sellOrLease: "Sell",
    status: "",
    ownershipType: "",
    location: "",
    addressLocation: "",
    minAge: "",
    maxAge: "",
    minPrice: "",
    maxPrice: "",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayedCards, setDisplayedCards] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numeric values
    if (
      [
        "minAge",
        "maxAge",
        "minPrice",
        "maxPrice",
        "minRentAmount",
        "maxRentAmount",
      ].includes(name)
    ) {
      if (/^\d*$/.test(value)) {
        setFilters({ ...filters, [name]: value });
      }
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    setError(null);

    // Filter out empty values from the filters object
    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );

    // Build query string from filteredParams
    const queryString = new URLSearchParams(filteredParams).toString();

    try {
      const response = await axios.get(
        `/api/v1/property/filter?${queryString}`
      );
      setProperties(response.data.propertiesWithImg || []);
      setDisplayedCards(response.data.propertiesWithImg || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  // Trigger filter on initial load or when filters change
  useEffect(() => {
    handleFilter();
  }, [filters]);



  // Function to handle property view
  const handleView = (property) => {
  navigate(`/properties/get/${property._id}`);
  };

  // Function to format amount
  const formatAmount = (amount) => {
    // Add your logic for formatting amount here
    return amount; // Placeholder
  };

const handleResetFilters = () => {
  setFilters({
    layout: "",
    sellOrLease: "Sell", // or set to "Both" if needed
    status: "",
    ownershipType: "",
    location: "",
    addressLocation: "",
    minAge: "",
    maxAge: "",
    minPrice: "",
    maxPrice: "",
  });

  // Refetch properties after resetting filters
  handleFilter();
};




  return (
    <div>
      <div className="filter-form">
        <select name="layout" value={filters.layout} onChange={handleChange}>
          <option value="">Select Layout</option>
          <option value="1 RK">1 RK</option>
          <option value="1 BHK">1 BHK</option>
          <option value="1.5 BHK">1.5 BHK</option>
          <option value="2 BHK">2 BHK</option>
          <option value="2.5 BHK">2.5 BHK</option>
          <option value="3 BHK">3 BHK</option>
          <option value="3.5 BHK">3.5 BHK</option>
          <option value="4 BHK">4 BHK</option>
          <option value="4.5 BHK">4.5 BHK</option>
          <option value="5 BHK">5 BHK</option>
          <option value="5.5 BHK">5.5 BHK</option>
          <option value="6 BHK">6 BHK</option>
          <option value="7.5 BHK">7.5 BHK</option>
        </select>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="Under Construction">Under Construction</option>
          <option value="Ready to Move">Ready to Move</option>
        </select>

        <select
          name="ownershipType"
          value={filters.ownershipType}
          onChange={handleChange}
        >
          <option value="">Select Ownership Type</option>
          <option value="Freehold">Freehold</option>
          <option value="Co-operative Society">Co-operative Society</option>
          <option value="Leasehold">Leasehold</option>
        </select>

        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
        />

        <input
          type="text"
          name="addressLocation"
          value={filters.addressLocation}
          onChange={handleChange}
          placeholder="Address Location"
        />

        <input
          type="text"
          name="minAge"
          value={filters.minAge}
          onChange={handleChange}
          placeholder="Min Age"
        />

        <input
          type="text"
          name="maxAge"
          value={filters.maxAge}
          onChange={handleChange}
          placeholder="Max Age"
        />

        <input
          type="text"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min Price"
        />

        <input
          type="text"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max Price"
        />

        <button onClick={handleFilter}>Filter Properties</button>
        <button onClick={handleResetFilters}>Reset Filters</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="Popular-Props-Main">
          <div className="Popular-Props-Content">
            <div className="Popular-Props-Header">
              <h2>Popular Properties</h2>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="Popular-cards">
              {displayedCards.map((property) => {
                const amount = property.SellStartprice;

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
      )}
    </div>
  );
};

export default PropsBuy;
