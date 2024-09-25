import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "../../CSS/UpdateProps.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
 

const FACING_OPTIONS = ["North", "South", "East", "West"];
const FLOORING_OPTIONS = ["Marble", "Wooden", "Tiles"];
const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const OWNERSHIP_OPTIONS = ["Freehold", "Co-operative Society", "Leasehold"];
const LAYOUT_OPTIONS = [
  "1 RK",
  "1 BHK",
  "1.5 BHK",
  "2 BHK",
  "2.5 BHK",
  "3 BHK",
  "3.5 BHK",
  "4 BHK",
  "4.5 BHK",
  "5 BHK",
  "5.5 BHK",
  "6 BHK",
  "7.5 BHK",
];
const PROP_CLASS_OPTIONS = [
  "Apartment",
  "House",
  "Bungalow",
  "Villa",
  "Row House",
  "Studio Apartment",
];
const TRANSACTION_TYPE_OPTIONS = ["New", "Resale"];
const WATER_AVAILABILITY_OPTIONS = ["Available", "Not Available"];
const SELL_OR_LEASE = ["Sell", "Lease", "Both"];
const RENT_FREQUENCY_OPTIONS = ["Monthly", "Quarterly", "Annually"];

const UpdatePropertyForm = ({ property, onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: property,
  });

  const [propertyImages, setPropertyImages] = useState([]);
  const [logoImage, setLogoImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);

  const onDrop = (acceptedFiles) => {
    setPropertyImages(acceptedFiles);
    setImagePreviews(acceptedFiles.map((file) => URL.createObjectURL(file)));
  };

  const onDropLogo = (acceptedFiles) => {
    setLogoImage(acceptedFiles[0]);
  };

  useEffect(() => {
    if (logoImage) {
      const preview = URL.createObjectURL(logoImage);
      setLogoPreview(preview);
      return () => URL.revokeObjectURL(preview);
    } else {
      setLogoPreview(null);
    }
  }, [logoImage]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const {
    getRootProps: getRootPropsImages,
    getInputProps: getInputPropsImages,
  } = useDropzone({ onDrop, multiple: true, accept: "image/*" });
  const { getRootProps: getRootPropsLogo, getInputProps: getInputPropsLogo } =
    useDropzone({ onDrop: onDropLogo, multiple: false, accept: "image/*" });
const onSubmit = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  propertyImages.forEach((file, index) => {
    formData.append(`propertyImg[${index}]`, file);
  });

  if (logoImage) {
    formData.append("singleLogo", logoImage);
  }

  try {
    const response = await axios.put(
      `/api/v1/owner/property/update/${property._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response); // Log the full response
    toast.success(response.data.message);
    reset();
    setImagePreviews([]);
    setLogoPreview(null);
    onClose();
  } catch (error) {
    console.error("Error:", error); // Log the error
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};
  return (
    <>
      <div className="update-property-container">
        <h2>Update Property</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* Address */}
          <div className="update-form-group">
            <label>Address:</label>
            <input type="text" {...register("address", { required: true })} />
            {errors.address && (
              <p className="update-error">Address is required</p>
            )}
          </div>

          {/* Additional Rooms */}
          <div className="update-form-group">
            <label>Additional Rooms:</label>
            <input type="text" {...register("additionalRooms")} />
          </div>

          {/* Age of Construction */}
          <div className="update-form-group">
            <label>Age of Construction:</label>
            <input
              type="text"
              {...register("ageOfConstruction", { required: true })}
            />
            {errors.ageOfConstruction && (
              <p className="update-error">Age of Construction is required</p>
            )}
          </div>

          {/* Carpet Area */}
          <div className="update-form-group">
            <label>Carpet Area:</label>
            <input
              type="number"
              {...register("carpetarea", { required: true })}
            />
            {errors.carpetarea && (
              <p className="update-error">Carpet Area is required</p>
            )}
          </div>

          {/* Electricity Status */}
          <div className="update-form-group">
            <label>Electricity Status:</label>
            <input
              type="text"
              {...register("electricityStatus", { required: true })}
            />
            {errors.electricityStatus && (
              <p className="update-error">Electricity Status is required</p>
            )}
          </div>
          {/* Furnishing */}
          <div className="update-form-group">
            <label>Furnishing:</label>
            <select {...register("furnishing", { required: true })}>
              <option value="">Select Furnishing</option>
              {FURNISHING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.furnishing && (
              <p className="update-error">Furnishing is required</p>
            )}
          </div>

          {/* Floor */}
          <div className="update-form-group">
            <label>Floor:</label>
            <input type="text" {...register("floor", { required: true })} />
            {errors.floor && <p className="update-error">Floor is required</p>}
          </div>

          {/* Total Floors */}
          <div className="update-form-group">
            <label>Total Floors:</label>
            <input
              type="number"
              {...register("totalFloors", { required: true })}
            />
            {errors.totalFloors && (
              <p className="update-error">Total Floors is required</p>
            )}
          </div>

          {/* Layout */}
          <div className="update-form-group">
            <label>Layout:</label>
            <select {...register("layout", { required: true })}>
              <option value="">Select Layout</option>
              {LAYOUT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.layout && (
              <p className="update-error">Layout is required</p>
            )}
          </div>

          {/* Ownership Type */}
          <div className="update-form-group">
            <label>Ownership Type:</label>
            <select {...register("ownershipType", { required: true })}>
              <option value="">Select Ownership Type</option>
              {OWNERSHIP_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.ownershipType && (
              <p className="update-error">Ownership Type is required</p>
            )}
          </div>

          {/* Property Class */}
          <div className="update-form-group">
            <label>Property Class:</label>
            <select {...register("propClass", { required: true })}>
              <option value="">Select Property Class</option>
              {PROP_CLASS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.propClass && (
              <p className="update-error">Property Class is required</p>
            )}
          </div>

          {/* Transaction Type */}
          <div className="update-form-group">
            <label>Transaction Type:</label>
            <select {...register("transactionType", { required: true })}>
              <option value="">Select Transaction Type</option>
              {TRANSACTION_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.transactionType && (
              <p className="update-error">Transaction Type is required</p>
            )}
          </div>

          {/* Rent Amount */}
          <div className="update-form-group">
            <label>Rent Amount:</label>
            <input type="number" {...register("rentAmount")} />
          </div>

          {/* Rent Frequency */}
          <div className="update-form-group">
            <label>Rent Frequency:</label>
            <select {...register("rentFrequency")}>
              <option value="">Select Rent Frequency</option>
              {RENT_FREQUENCY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Selling or Leasing */}
          <div className="update-form-group">
            <label>Sell or Lease:</label>
            <select {...register("sellOrLease", { required: true })}>
              <option value="">Select Option</option>
              {SELL_OR_LEASE.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.sellOrLease && (
              <p className="update-error">Sell or Lease is required</p>
            )}
          </div>

          {/* Price Breakup */}
          <div className="update-form-group">
            <label>Price Breakup:</label>
            <input type="text" {...register("priceBreakup")} />
          </div>

          {/* Price Per Sqft */}
          <div className="update-form-group">
            <label>Price Per Sqft:</label>
            <input
              type="number"
              {...register("pricePerSqft", { required: true })}
            />
            {errors.pricePerSqft && (
              <p className="update-error">Price Per Sqft is required</p>
            )}
          </div>

          <div className="update-form-buttons">
            <button type="submit" className="update-submit-button">
              Update
            </button>
            <button
              type="button"
              className="update-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
};

export default UpdatePropertyForm;
