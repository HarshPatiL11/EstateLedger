import React from "react";
import "../CSS/Card.css";
import { MdOutlinePhotoLibrary } from "react-icons/md";

const Card = ({
  layout,
  type,
  status,
  imageNum,
  amount,
  carpetArea,
  location,
  image,
  onClick,
}) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="image-container">
        <img src={image} alt="Property Thumbnail" className="card-thumbnail" />
        <div className="image-label"><MdOutlinePhotoLibrary/>{imageNum}</div>
        {/* Assuming 12 images as an example */}
      </div>
      <div className="card-details">
        <h3 className="type">
          {layout} {type}
        </h3>
        <p className="price">
          ₹{amount} | {carpetArea} sqft
        </p>
        <p className="location">{location}</p>
        <p className="status">{status}</p>
        <div className="cardbtn">
          View more
        </div>
      </div>
    </div>
  );
};

export default Card;
