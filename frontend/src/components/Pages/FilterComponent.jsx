import React, { useState } from "react";
import axios from "axios";
import "../CSS/propsFilter.css";

const PropertyFilter = () => {
  const [filters, setFilters] = useState({
    layout: "",
    sellOrLease: "",
    status: "",
    ownershipType: "",
    location: "",
    addressLocation: "",
    minAge: "",
    maxAge: "",
    minPrice: "",
    maxPrice: "",
    minRentAmount: "",
    maxRentAmount: "",
    rentFrequency: "",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

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
      if (/^\d*\.?\d*$/.test(value)) {
        setFilters({ ...filters, [name]: value });
      }
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleFilter = async () => {
    setLoading(true);

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
      setProperties(response.data.propertiesWithImg);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Filter Properties</h2>
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

        <select
          name="sellOrLease"
          value={filters.sellOrLease}
          onChange={handleChange}
        >
          <option value="">Sell or Lease</option>
          <option value="Sell">Sell</option>
          <option value="Lease">Lease</option>
          <option value="Both">Both</option>
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

        <input
          type="text"
          name="minRentAmount"
          value={filters.minRentAmount}
          onChange={handleChange}
          placeholder="Min Rent Amount"
        />

        <input
          type="text"
          name="maxRentAmount"
          value={filters.maxRentAmount}
          onChange={handleChange}
          placeholder="Max Rent Amount"
        />

        <select
          name="rentFrequency"
          value={filters.rentFrequency}
          onChange={handleChange}
        >
          <option value="">Select Rent Frequency</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </select>

        <button onClick={handleFilter}>Filter Properties</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="properties-list">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property._id} className="property-card">
                <h3>{property.layout}</h3>
                <p>{property.location}</p>
                <p>Price: {property.SellStartprice}</p>
                <p>Rent: {property.rentAmount}</p>
                {property.propertyImg && property.propertyImg.length > 0 && (
                  <img
                    src={property.propertyImg[0].data}
                    alt="Property"
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No properties found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyFilter;
