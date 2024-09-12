import Interested from "../Model/InterestPropsModel.js";
import Property from "../Model/propertyModel.js";
import User from "../Model/userModel.js";

// Express interest in a property
export const expressInterest = async (req, res) => {
  const userId = req.userId;
  const { ownerid, propertyId } = req.body;

  try {
    // Validate if the property, user, and owner exist
    const property = await Property.findById(propertyId);
    if (!property) {
      console.error(`Property with ID ${propertyId} not found.`);
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return res.status(404).json({ message: "User not found" });
    }

    const owner = await User.findById(ownerid);
    if (!owner) {
      console.error(`Owner with ID ${ownerid} not found.`);
      return res.status(404).json({ message: "Owner not found" });
    }

    // Create an interest entry
    const interest = await Interested.create({
      userId,
      ownerid,
      propertyId,
    });

    res.status(201).json({
      message: "Interest recorded successfully",
      interest,
    });
  } catch (error) {
    console.error(`Error recording interest: ${error.message}`, error);
    res.status(500).json({
      message: "Failed to record interest",
      error: error.message,
    });
  }
};
