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

      const existingInterest = await Interested.findOne({ userId, propertyId });
      if (existingInterest) {
        console.log(
          `User with ID ${userId} has already shown interest in property with ID ${propertyId}.`
        );
        return res.status(409).json({ message: "Interest already recorded" }); // 409 Conflict
      }
    // Create an interest entry
    const interest = await Interested.create({
      userId,
      ownerid,
      propertyId,
    });

    // Send response
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


export const getUserInterest = async (req, res) => {
  const id  = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(404).send({ message: "No User id Provided", success: false });
  }
   if (!id) {
     return res
       .status(404)
       .send({ message: "No propertyId  Provided", success: false });
   }

  try {
    const interest = await Interested.findOne({ userId, id });

    if (interest) {
      res.status(200).json({ interested: true });
    } else {
      res.status(200).json({ interested: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve interest record" });
  }
};

// get user interest approved by the Owner
export const getApprovedInterests = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have middleware to attach user to req
    const approvedInterests = await Interested.find({ userId, isApprove: true })
      .populate({
        path: 'propertyId',
        select: 'project SellStartprice rentAmount sellOrLease',
      })
      .exec();

    if (approvedInterests.length === 0) {
      return res.status(404).json({ message: 'No approved properties found.' });
    }

    // Attach additional details to each interest
    const result = approvedInterests.map(interest => ({
      ...interest.toObject(),
      approvedDate: interest.updatedAt.toISOString(), // Date when the user expressed interest
      propertyDetails: interest.propertyId,
    }));

    res.json({ approvedProjects: result });
  } catch (error) {
    console.error('Error fetching approved properties:', error);
    res.status(500).json({ message: 'Error fetching approved properties.' });
  }
};
