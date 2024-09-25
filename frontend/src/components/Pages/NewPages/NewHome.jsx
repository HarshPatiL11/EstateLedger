import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../CSS/NewHome.css";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Card from "../Card.jsx"; // Ensure the Card component is correctly imported
import { MdHome } from "react-icons/md";
const NewHome = () => {
  const [filters, setFilters] = useState({
    location: "",
    layout: "",
    minPrice: "",
    maxPrice: "",
    minRentAmount: "",
    maxRentAmount: "",
    sellOrLease: "Sell",
  });

  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const defaultItem =
      filters.sellOrLease === "Sell"
        ? menuRef.current.querySelector("li:nth-child(1)")
        : menuRef.current.querySelector("li:nth-child(2)");
    updateUnderline(defaultItem);
  }, [filters.sellOrLease]);

  // This effect will trigger the search whenever "Buy" or "Sell" is clicked
  useEffect(() => {
    if (searchTriggered) {
      handleSearch();
    }
  }, [filters.sellOrLease]);

  const updateUnderline = (item) => {
    if (!item) return;
    const itemRect = item.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const itemLeft = itemRect.left - menuRect.left;

    setUnderlineStyle({
      left: itemLeft,
      width: itemRect.width,
    });
  };

  const resetUnderline = () => {
    const defaultItem =
      filters.sellOrLease === "Sell"
        ? menuRef.current.querySelector("li:nth-child(1)")
        : menuRef.current.querySelector("li:nth-child(2)");
    updateUnderline(defaultItem);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    const filteredParams = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (filters.sellOrLease === "Sell" && key === "minRentAmount")
          return false;
        if (filters.sellOrLease === "Sell" && key === "maxRentAmount")
          return false;
        if (filters.sellOrLease === "Lease" && key === "minPrice") return false;
        if (filters.sellOrLease === "Lease" && key === "maxPrice") return false;
        return value !== "";
      })
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    try {
      const response = await axios.get(
        `/api/v1/property/filter?${queryString}`
      );
      if (response.data && response.data.propertiesWithImg) {
        setProperties(response.data.propertiesWithImg);
      } else {
        setProperties([]);
        setError("No properties found.");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(`Error fetching properties: ${error.message}`);
    } finally {
      setLoading(false);
      setSearchTriggered(true); // Set searchTriggered to true after search
    }
  };

  const handleView = (property) => {
    navigate(`/properties/get/${property._id}`);
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)} cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)} lac`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)} k`;
    } else {
      return amount.toString();
    }
  };

  const handleTabClick = (type) => {
    setFilters((prevFilters) => ({ ...prevFilters, sellOrLease: type }));
    setSearchTriggered(true); // Ensure that the search gets triggered after the state updates
  };

  return (
    <div className="home-container">
      <div className="home-main-section">
        <h2 className="home-header">
          Find a home you'll{" "}
          <span
            style={{
              fontFamily: "Damion, Arial, sans-serif",
              fontSize: "48px",
            }}
          >
            love
          </span>
        </h2>

        <div className="home-nav-bar">
          <ul
            className="home-nav-menu"
            ref={menuRef}
            onMouseLeave={resetUnderline}
          >
            <li
              className="home-nav-menu-options"
              onClick={() => handleTabClick("Sell")}
              onMouseEnter={(e) => updateUnderline(e.target)}
            >
              Buy
            </li>
            <li
              className="home-nav-menu-options"
              onClick={() => handleTabClick("Lease")}
              onMouseEnter={(e) => updateUnderline(e.target)}
            >
              Rent
            </li>
            <div className="underline" style={underlineStyle}></div>
          </ul>
        </div>

        <div className="home-search-bar">
          <div className="search-bar-location">
            <FaLocationDot />
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          <div className="home-search-layout">
            <MdHome />
            <select
              name="layout"
              value={filters.layout}
              onChange={handleFilterChange}
            >
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
          </div>

          <div className="home-search-buget">
            {filters.sellOrLease === "Sell" ? (
              <>
                <input
                  type="text"
                  name="minPrice"
                  value={filters.minPrice}
                  placeholder="Min Price"
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="maxPrice"
                  value={filters.maxPrice}
                  placeholder="Max Price"
                  onChange={handleFilterChange}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="minRentAmount"
                  value={filters.minRentAmount}
                  placeholder="Min Rent Amount"
                  onChange={handleFilterChange}
                />
                <input
                  type="text"
                  name="maxRentAmount"
                  value={filters.maxRentAmount}
                  placeholder="Max Rent Amount"
                  onChange={handleFilterChange}
                />
              </>
            )}
          </div>

          <div className="search-bar-submit" onClick={handleSearch}>
            Search
          </div>
        </div>
      </div>

      {searchTriggered && (
        <>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {properties.length > 0 ? (
            <div className="Popular-Props-Main">
              <div className="Popular-Props-Content">
                <div className="Popular-Props-Header">
                  <h2> Filter Result</h2>
                </div>
                <div className="Popular-cards">
                  {properties.map((property) => {
                    const amount =
                      filters.sellOrLease === "Sell"
                        ? property.SellStartprice
                        : property.rentAmount > 0
                        ? property.rentAmount
                        : property.SellStartprice;

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
          ) : (
            !loading && <p>No properties match your criteria.</p>
          )}
        </>
      )}
    </div>
  );
};

export default NewHome;
