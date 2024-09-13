import React from "react";
import Modal from "../Modal"; // Import the Modal component
import UpdatePropertyForm from "./UpdatePropertyForm"; // Import the UpdatePropertyForm component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PropertyUpdatePage = ({ property, onClose }) => {
  return (
    <div>
        <UpdatePropertyForm property={property} onClose={onClose} />
        <ToastContainer/>
    </div>
  );
};

export default PropertyUpdatePage;
