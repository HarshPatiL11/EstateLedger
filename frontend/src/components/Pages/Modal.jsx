// Modal.jsx
import React from "react";
import "../CSS/Modal.css"; // Add your CSS styles for the modal here
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
       
        {children}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Modal;
