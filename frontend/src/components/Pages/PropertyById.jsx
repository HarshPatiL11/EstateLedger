  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
  import "../CSS/PropertyById.css";
  import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
  import { MdVerified } from "react-icons/md";

  const PropertyById = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isInterested, setIsInterested] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [newRating, setNewRating] = useState(null);
    useEffect(() => {
      const fetchProperty = async () => {
        try {
          const response = await axios.get(`/api/v1/property/${id}`);
          setProperty(response.data.propertyWithImg);
          setLoading(false);
          if (response.data.propertyWithImg.propertyImg.length > 0) {
            setSelectedImage(response.data.propertyWithImg.propertyImg[0].data);
          }
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      const fetchRatings = async () => {
        const token = localStorage.getItem("userToken");
        try {
          if (token) {
            const [userRatingRes, avgRatingRes] = await Promise.all([
              axios.get(`/api/v1/property/${id}/getUserRating`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
              axios.get(`/api/v1/property/${id}/getAvgRating`),
            ]);
            console.log("User Rating Response:", userRatingRes.data);
            console.log("Average Rating Response:", avgRatingRes.data);
            setUserRating(userRatingRes.data);
            setAverageRating(avgRatingRes.data);
          } else {
            const avgRatingRes = await axios.get(
              `/api/v1/property/${id}/getAvgRating`
            );
            console.log("Average Rating Response (No Token):", avgRatingRes.data);
            setAverageRating(avgRatingRes.data);
          }
        } catch (error) {
          console.error("Error fetching ratings:", error);
        }
        setLoading(false);
      };



    const fetchUserInterest = async () => {
      const token = localStorage.getItem("userToken");
      try {
        if (token) {
          const response = await axios.get(
            `/api/v1/user/profile/property/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsInterested(response.data.interested);
        }
      } catch (error) {
        console.error("Error fetching user interest:", error);
      }
    };

       fetchProperty();
       fetchRatings();
       fetchUserInterest();
    }, [id]);

    const handleInterested = async () => {
      const token = localStorage.getItem("userToken");
      try {
        await axios.post(
          "/api/v1/property/interested",
          {
            ownerid: property?.owner,
            propertyId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsInterested(true);
      } catch (error) {
        console.error("Error expressing interest:", error);
      }
    };
    const submitRating = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("Please log in to give a rating");
        return;
      }

      if (newRating) {
        try {
          const response = await axios.post(
            `/api/v1/property/${id}/addRating`,
            {
              rating: newRating,
              propertyId: id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { avgRating, userRating } = response.data;
          setAverageRating(avgRating);
          setUserRating(userRating);
          setNewRating(null);
        } catch (error) {
          console.error("Error submitting rating:", error);
        }
      }
    };

    const handleRatingClick = (rating) => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("Please log in to give a rating");
        return;
      }

      setNewRating(rating);
    };

   const renderStarRating = (rating) => {
     return Array.from({ length: 5 }, (_, index) => {
       const starRating = index + 1;
       if (rating >= starRating) {
         return <FaStar key={index} className="star-icon" />;
       } else if (rating >= starRating - 0.5) {
         return <FaStarHalfAlt key={index} className="star-icon" />;
       } else {
         return <FaRegStar key={index} className="star-icon" />;
       }
     });
   };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error loading property data.</div>;

    const calculatePricePerSqft = (price) => {
      const area = property?.carpetarea;
      if (area && price) {
        return (price / area).toFixed(2);
      }
      return null;
    };

    const sellPricePerSqft =
      property?.sellOrLease === "Sell" || property?.sellOrLease === "Both"
        ? calculatePricePerSqft(property?.SellStartprice)
        : null;

    const rentPricePerSqft =
      property?.sellOrLease === "Lease" || property?.sellOrLease === "Both"
        ? calculatePricePerSqft(property?.rentAmount)
        : null;

    return (
      <>
        <div className="property-details-container">
          {/* Existing Sections */}
          <div className="property-details-section1">
            <div className="property-details-Header">
              <h1>
                {property?.project || "Loading project name..."}{" "}
                {/* Conditional check */}
                {property?.isApproved ? (
                  <MdVerified
                    style={{
                      color: "green",
                      fontSize: "1em",
                      marginLeft: "10px",
                    }}
                  />
                ) : null}
              </h1>
              <div className="Sec1-subheader1">
                <span>
                  {property?.layout},{property?.propClass} with area of{" "}
                  {property?.carpetarea} sqft, for {property?.sellOrLease} at{" "}
                  {property?.location}
                </span>
              </div>
            </div>
            <div className="image-section">
              <div className="main-image">
                {selectedImage ? (
                  <img src={selectedImage} alt="Selected Property" />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="thumbnail-images">
                {property?.propertyImg?.map((img, index) => (
                  <img
                    key={index}
                    src={img.data}
                    alt={`Property Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(img.data)}
                    className="thumbnail"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Interested Button */}
          <div className="Intrested-Btn-div">
            <h6>Are you Interested?</h6>
            <button
              onClick={handleInterested}
              disabled={isInterested}
              className="interested-btn"
            >
              {isInterested ? "Interested" : "I am Interested"}
            </button>
            {isInterested ? <p>The Owner Will contact You Soon</p> :(null)}
          </div>
          {/* New Property Details Section */}
          <div className="props-details-sec2">
            <h2>Key Property Details</h2>
            <p>
              <strong>Carpet Area:</strong> {property?.carpetarea} sqft
            </p>
            <p>
              <strong>Floor:</strong> {property?.floor} out of{" "}
              {property?.totalFloors}
            </p>
            <p>
              <strong>Status:</strong> {property?.status}
            </p>
            <p>
              <strong>Additional Rooms:</strong> {property?.additionalRooms}
            </p>
            <p>
              <strong>Facing:</strong> {property?.facing}
            </p>
            <p>
              <strong>Lifts:</strong> {property?.lifts}
            </p>
            <p>
              <strong>Furnished:</strong> {property?.furnishing}
            </p>
            <p>
              <strong>Your Rating:</strong>{" "}
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {newRating >= index + 1 ? (
                    <FaStar
                      onClick={() => handleRatingClick(index + 1)}
                      className="rating-star"
                    />
                  ) : (
                    <FaRegStar
                      onClick={() => handleRatingClick(index + 1)}
                      className="rating-star"
                    />
                  )}
                </span>
              ))}
              <label onClick={submitRating}>Rate</label>
            </p>
            <p>
              <strong>Average Rating:</strong> {renderStarRating(averageRating)}
            </p>
          </div>

          {/* Other Details Section */}
          {/* Other Details Section */}
          <div className="Props-other-details">
            <h2>Other Property Details</h2>
            <table className="property-details-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Address:</strong>
                  </td>
                  <td>{property?.address}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Location:</strong>
                  </td>
                  <td>{property?.location}</td>
                </tr>
                {/* Adding Price / Rent Details */}
                {(property?.sellOrLease === "Sell" ||
                  property?.sellOrLease === "Both") && (
                  <>
                    <tr>
                      <td>
                        <strong>Selling Price:</strong>
                      </td>
                      <td>₹{property?.SellStartprice}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Price Per Sqft:</strong>
                      </td>
                      <td>₹{sellPricePerSqft}</td>
                    </tr>
                  </>
                )}

                {/* Rent Price and Rent per Sqft */}
                {(property?.sellOrLease === "Lease" ||
                  property?.sellOrLease === "Both") && (
                  <>
                    <tr>
                      <td>
                        <strong>Rent Amount:</strong>
                      </td>
                      <td>₹{property?.rentAmount}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Rent Frequency:</strong>
                      </td>
                      <td>{property?.rentFrequency}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Rent Price Per Sqft:</strong>
                      </td>
                      <td>₹{rentPricePerSqft}</td>
                    </tr>
                  </>
                )}
                {property?.sellOrLease === "Both" && (
                  <>
                    <tr>
                      <td>
                        <strong>Price Per Sqft:</strong>
                      </td>
                      <td>
                        {sellPricePerSqft ? ` ₹ ${sellPricePerSqft} ` : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Rent Amount:</strong>
                      </td>
                      <td>₹{property?.rentAmount}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Rent Frequency:</strong>
                      </td>
                      <td>{property?.rentFrequency}</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td>
                    <strong>Age of Construction:</strong>
                  </td>
                  <td>{property?.ageOfConstruction}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Developer:</strong>
                  </td>
                  <td>{property?.developer}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Electricity Status:</strong>
                  </td>
                  <td>{property?.electricityStatus}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Flooring:</strong>
                  </td>
                  <td>{property?.flooring?.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Landmarks:</strong>
                  </td>
                  <td>{property?.landmarks}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Ownership Type:</strong>
                  </td>
                  <td>{property?.ownershipType}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Overlooking:</strong>
                  </td>
                  <td>{property?.overlooking?.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Price Breakup:</strong>
                  </td>
                  <td>{property?.priceBreakup}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Transaction Type:</strong>
                  </td>
                  <td>{property?.transactionType}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Water Availability:</strong>
                  </td>
                  <td>{property?.waterAvailability}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  };

  export default PropertyById;
