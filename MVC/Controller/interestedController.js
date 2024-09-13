import Interested from "../Model/InterestPropsModel.js";

//get interested all
export const getInterestedAll = async (req, res) => {
  try {
    // Fetch all interested records
    const records = await Interested.find({});

    if (!records.length) {
      return res.status(404).json({
        success: false,
        message: "No interested users found",
      });
    }

    // Log the records for debugging
    console.log("Fetched interested users:", records);

    // Return the records
    return res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    console.error("Error fetching interested users:", error);

    // Return error response
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// Get all users interested in an owner's property
export const getInterestedUsersByOwnerId = async (req, res) => {
  try {
    const ownerId = req.userId; // Get ownerId from params or another source
    console.log(`Owner ID: ${ownerId}`);

    // Check if ownerId is valid
    if (!ownerId) {
      console.error("Invalid owner ID");
      return res.status(400).json({ message: "Owner ID is required" });
    }

    // Find interested users based on ownerId
    const interestedList = await Interested.find({ ownerid: ownerId })
      .populate({
        path: "userId",
        select: "name email phone", // Only select the necessary fields
      })
      .populate({
        path: "propertyId",
        select: "project", // Only select the project name
      });

    console.log(`Interested List: ${JSON.stringify(interestedList)}`);

    // Handle case where no interested users are found
    if (interestedList.length === 0) {
      console.warn("No interested users found for the given owner ID");
      return res.status(404).json({ message: "No interested users found" });
    }

    // Format the response to include user and property details
    const interestedUsers = interestedList.map((item) => {
      // Add null checks for userId and propertyId
      const user = item.userId ? {
        userId: item.userId._id,
        name: item.userId.name,
        email: item.userId.email,
        phone: item.userId.phone
      } : {
        userId: null,
        name: "Unknown",
        email: "Unknown",
        phone: "Unknown"
      };

      const property = item.propertyId ? {
        propertyId: item.propertyId._id,
        projectName: item.propertyId.project
      } : {
        propertyId: null,
        projectName: "Unknown"
      };

      return {
        _id: item._id,
        ...user,
        ...property,
        isApprove: item.isApprove,
        interestedDate: item.createdAt,
        approvedDate: item.updatedAt,
      };
    });

    res.json({ success: true, interestedUsers });
  } catch (error) {
    console.error("Error in getInterestedUsersByOwnerId:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// Approve an interested user's request by the owner
export const approveInterestedUser = async (req, res) => {
  try {
   console.log("Received params:", req.params);

    const _id  = req.params; // Read _id from request parameters
    // Check if _id is provided
    if (!_id) {
      return res.status(404).json({
        success: false,
        message: "Interest ID not found.",
      });
    }

    // Check if the user has the required permissions (owner or admin)
    if (req.userType !== "owner" && req.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only owners or admins can approve interests.",
      });
    }

    // Find the interest record by its ID
    const interestRecord = await Interested.findById(_id); // Use _id directly here
    console.log("Interest Record:", interestRecord);

    // Check if the interest record exists
    if (!interestRecord) {
      return res.status(404).json({
        success: false,
        message: "Interest record not found.",
      });
    }

    // Check if the logged-in user is the correct owner of the property
    if (interestRecord.ownerid.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only approve interests for your own properties.",
      });
    }

    // Approve the interest
    interestRecord.isApprove = true;
    await interestRecord.save();

    return res.status(200).json({
      success: true,
      message: "User interest approved successfully.",
      interestRecord, // Return the updated interest record
    });
  } catch (error) {
    console.error("Error approving interest:", error); // Log error for debugging
    return res.status(500).json({
      success: false,

      message: "Server error || errror in Approve user Approve",
      error: error.message, // Return error details for debugging
    });
  }
};
