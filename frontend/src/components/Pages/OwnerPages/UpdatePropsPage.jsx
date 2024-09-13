import React from "react";
import Modal from "../Modal"; // Import the Modal component
import UpdatePropertyForm from "./UpdatePropertyForm"; // Import the UpdatePropertyForm component

const PropertyUpdatePage = ({ property, onClose }) => {
  return (
    <div>
        <UpdatePropertyForm property={property} onClose={onClose} />
    </div>
  );
};

export default PropertyUpdatePage;
