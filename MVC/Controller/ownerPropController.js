import fs from "fs";
import Property from "../Models/PropertyModel.js";
import User from "../models/userModel";

export const getPropertiesByOwnerName = async (req, res) => {
  try {
    // Get owner name from request query
    const { ownerName } = req.query;

    // Find users by name 
    const owners = await User.find({ name: ownerName });

    if (!owners.length) {
      return res.status(404).json({ message: "Owner not found" });
    }
    const ownerIds = owners.map((owner) => owner._id);

    const properties = await Property.find({ owner: { $in: ownerIds } });

    if (!properties.length) {
      return res
        .status(404)
        .json({ message: "No properties found for this owner" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error });
  }
};