import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "../../CSS/AddProps2.css";
import { useNavigate } from "react-router";
import { login, logout } from "../../Redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";


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

const AddProperty = () => {
  const [propertyImages, setPropertyImages] = useState([]);
  const [logoImage, setLogoImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const chkUser = async () => {
      const token = localStorage.getItem("userToken");
      if (!token || !isLoggedIn) {
        toast.error("No authentication token found. Please log in.");
        dispatch(logout());
        navigate("/user/login");
        return;
      }

      try {
        const response = await axios.get("/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the user is an Admin or Owner
        if (
          response.data.userType !== "admin" &&
          response.data.userType !== "owner"
        ) {
          toast.error("You do not have permission to add properties.");
          navigate("/user/become-seller");
        }
      } catch (error) {
        toast.error("Failed to fetch user profile. Please log in again.");
        console.log(error);
        navigate("/user/login");
      }
    };

    chkUser();
  }, [dispatch, isLoggedIn, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const onDrop = (acceptedFiles) => {
    setPropertyImages((prevImages) => [...prevImages, ...acceptedFiles]);
    setImagePreviews((prevPreviews) => [
      ...prevPreviews,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
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
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        "http://localhost:8000/api/v1/owner/property/add-property/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      reset();
      setImagePreviews([]);
      setLogoPreview(null);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  return (
    <div className="add-property-container">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {/* Address */}
        <div className="form-group">
          <label>Address:</label>
          <input type="text" {...register("address", { required: true })} />
          {errors.address && <p className="error">Address is required</p>}
        </div>

        {/* Additional Rooms */}
        <div className="form-group">
          <label>Additional Rooms:</label>
          <input type="text" {...register("additionalRooms")} />
        </div>

        {/* Age of Construction */}
        <div className="form-group">
          <label>Age of Construction:</label>
          <input
            type="text"
            {...register("ageOfConstruction", { required: true })}
          />
          {errors.ageOfConstruction && (
            <p className="error">Age of Construction is required</p>
          )}
        </div>

        {/* Carpet Area */}
        <div className="form-group">
          <label>Carpet Area:</label>
          <input
            type="number"
            {...register("carpetarea", { required: true })}
          />
          {errors.carpetarea && (
            <p className="error">Carpet Area is required</p>
          )}
        </div>

        {/* Developer */}
        <div className="form-group">
          <label>Developer:</label>
          <input type="text" {...register("developer", { required: true })} />
          {errors.developer && <p className="error">Developer is required</p>}
        </div>

        {/* Electricity Status */}
        <div className="form-group">
          <label>Electricity Status:</label>
          <input
            type="text"
            {...register("electricityStatus", { required: true })}
          />
          {errors.electricityStatus && (
            <p className="error">Electricity Status is required</p>
          )}
        </div>

        {/* Facing */}
        <div className="form-group">
          <label>Facing:</label>
          <select {...register("facing", { required: true })}>
            <option value="">Select Facing</option>
            {FACING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.facing && <p className="error">Facing is required</p>}
        </div>

        {/* Flooring */}
        <div className="form-group">
          <label>Flooring:</label>
          <select {...register("flooring", { required: true })}>
            <option value="">Select Flooring</option>
            {FLOORING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.flooring && <p className="error">Flooring is required</p>}
        </div>

        {/* Furnishing */}
        <div className="form-group">
          <label>Furnishing:</label>
          <select {...register("furnishing", { required: true })}>
            <option value="">Select Furnishing</option>
            {FURNISHING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.furnishing && <p className="error">Furnishing is required</p>}
        </div>

        {/* Floor */}
        <div className="form-group">
          <label>Floor:</label>
          <input type="text" {...register("floor", { required: true })} />
          {errors.floor && <p className="error">Floor is required</p>}
        </div>

        {/* Total Floors */}
        <div className="form-group">
          <label>Total Floors:</label>
          <input
            type="number"
            {...register("totalFloors", { required: true })}
          />
          {errors.totalFloors && (
            <p className="error">Total Floors is required</p>
          )}
        </div>

        {/* Lifts */}
        <div className="form-group">
          <label>Lifts:</label>
          <input type="number" {...register("lifts", { required: true })} />
          {errors.lifts && <p className="error">Lifts are required</p>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location:</label>
          <input type="text" {...register("location", { required: true })} />
          {errors.location && <p className="error">Location is required</p>}
        </div>

        {/* Loan Offered */}
        <div className="form-group">
          <label>Loan Offered:</label>
          <input type="text" {...register("loanOffered")} />
        </div>

        {/* Landmarks */}
        <div className="form-group">
          <label>Landmarks:</label>
          <input type="text" {...register("landmarks", { required: true })} />
          {errors.landmarks && <p className="error">Landmarks are required</p>}
        </div>

        {/* Layout */}
        <div className="form-group">
          <label>Layout:</label>
          <select {...register("layout", { required: true })}>
            <option value="">Select Layout Type</option>
            {LAYOUT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.layout && <p className="error">Layout is required</p>}
        </div>

        {/* Ownership Type */}
        <div className="form-group">
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
            <p className="error">Ownership Type is required</p>
          )}
        </div>

        {/* Overlooking */}
        <div className="form-group">
          <label>Overlooking:</label>
          <input type="text" {...register("overlooking")} />
        </div>

        {/* Price Breakup */}
        <div className="form-group">
          <label>Price Breakup:</label>
          <input type="text" {...register("priceBreakup")} />
        </div>

        {/* Price Per Sqft */}
        <div className="form-group">
          <label>Price Per Sqft:</label>
          <input type="number" {...register("pricePerSqft")} />
        </div>

        {/* Property Class */}
        <div className="form-group">
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
            <p className="error">Property Class is required</p>
          )}
        </div>

        {/* Project */}
        <div className="form-group">
          <label>Project:</label>
          <input type="text" {...register("project")} />
        </div>

        {/* Sell Start Price */}
        <div className="form-group">
          <label>Sell Start Price:</label>
          <input type="number" {...register("SellStartprice")} />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status:</label>
          <input type="text" {...register("status")} />
        </div>

        {/* Transaction Type */}
        <div className="form-group">
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
            <p className="error">Transaction Type is required</p>
          )}
        </div>

        {/* Water Availability */}
        <div className="form-group">
          <label>Water Availability:</label>
          <select {...register("waterAvailability", { required: true })}>
            <option value="">Select Water Availability</option>
            {WATER_AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.waterAvailability && (
            <p className="error">Water Availability is required</p>
          )}
        </div>

        {/* Sell or Lease */}
        <div className="form-group">
          <label>Sell or Lease:</label>
          <select {...register("sellOrLease", { required: true })}>
            <option value="">Select Sell or Lease</option>
            {SELL_OR_LEASE.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.sellOrLease && (
            <p className="error">Sell or Lease is required</p>
          )}
        </div>

        {/* Rent Amount */}
        <div className="form-group">
          <label>Rent Amount:</label>
          <input type="number" {...register("rentAmount")} />
        </div>

        {/* Rent Frequency */}
        <div className="form-group">
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

        {/* Property Images */}
        <div {...getRootPropsImages()} className="form-group dropzone">
          <input {...getInputPropsImages()} />
          <p>Drag 'n' drop property images here, or click to select files</p>
        </div>
        {/* Image Previews */}
        <div className="image-previews">
          {imagePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Property Preview ${index}`} />
          ))}
        </div>

        {/* Single Logo */}
        <div {...getRootPropsLogo()} className="form-group dropzone">
          <input {...getInputPropsLogo()} />
          <p>Drag 'n' drop logo image here, or click to select a file</p>
        </div>
        {/* Logo Preview */}
        {logoPreview && (
          <div className="logo-preview">
            <img src={logoPreview} alt="Logo Preview" />
          </div>
        )}

        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty;
