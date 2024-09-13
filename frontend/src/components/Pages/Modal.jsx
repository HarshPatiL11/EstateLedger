// Modal.jsx
import React from "react";
import "../CSS/Modal.css"; // Add your CSS styles for the modal here

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
       
        {children}
      </div>
    </div>
  );
};

export default Modal;
