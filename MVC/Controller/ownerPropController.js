import fs from "fs";
import PropertySchema from "../Model/PropertyModel.js";

import UserSchema from "../Model/userModel.js";
import InterestPropsModel from "../Model/InterestPropsModel.js";


export const getPropertiesByOwnerName = async (req, res) => {
  try {
    // Get owner name from request query
    const { ownerName } = req.query;

    // Find users by name 
    const owners = await UserSchema.find({ name: ownerName });

    if (!owners.length) {
      return res.status(404).json({ message: "Owner not found" });
    }
    const ownerIds = owners.map((owner) => owner._id);

    const properties = await PropertySchema.find({ owner: { $in: ownerIds } });

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

export const getPropertiesByOwnerToken = async (req, res) => {
  try {
    const ownerId = req.userId;

    const owner = await UserSchema.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "User not found" });
    }

    const properties = await PropertySchema.find({ owner: ownerId });

    if (!properties.length) {
      return res
        .status(404)
        .json({ message: "No properties found for this owner" });
    }

    const propertiesWithImg = properties.map((property) => {
      const images = property.propertyImg.map((img) => ({
        data: img.data
          ? `data:${img.contentType};base64,${img.data.toString("base64")}`
          : null,
        contentType: img.contentType,
      }));

      return {
        ...property._doc,
        propertyImg: images,
      };
    });

    res.status(200).json({
      success: true,
      totalCount: propertiesWithImg.length,
      properties: propertiesWithImg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error,
    });
  }
};


