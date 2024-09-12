import fs from "fs";
import path from "path";
import PropertySchema from "../Model/propertyModel.js";
import InterestedSchema from "../Model/InterestPropsModel.js";
import InterestPropsModel from "../Model/InterestPropsModel.js";

// add Property API
export const registerProperty = async (req, res) => {
  try {
    const owner = req.userId;
    const {
      address,
      additionalRooms,
      ageOfConstruction,
      carpetarea,
      developer,
      electricityStatus,
      facing,
      flooring,
      furnishing,
      floor,
      lifts,
      location,
      loanOffered,
      landmarks,
      layout,
      ownershipType,
      overlooking,
      priceBreakup,
      pricePerSqft,
      propClass,
      project,
      SellStartprice,
      status,
      totalFloors,
      transactionType,
      waterAvailability,
      sellOrLease,
      rentAmount,
      rentFrequency,
    } = req.fields;

    // validate required fields
    if (
      !owner ||
      !address ||
      !ageOfConstruction ||
      !carpetarea ||
      !developer ||
      !electricityStatus ||
      !facing ||
      !flooring ||
      !furnishing ||
      !floor ||
      !lifts ||
      !location ||
      !landmarks ||
      !layout ||
      !ownershipType ||
      !overlooking ||
      !priceBreakup ||
      !pricePerSqft ||
      !propClass ||
      !project ||
      !SellStartprice ||
      !status ||
      !totalFloors ||
      !transactionType ||
      !waterAvailability ||
      ((sellOrLease === "Lease" || sellOrLease === "Both") &&
        (!rentAmount || !rentFrequency))
    ) {
      return res.status(400).send({
        success: false,
        message: "All required fields must be filled.",
      });
    }
    // Parse and validate property images
    let propertyImg = [];
    let i = 0;
    while (req.files[`propertyImg[${i}]`]) {
      const image = req.files[`propertyImg[${i}]`];
      if (image.size > 1000000) {
        return res.status(400).send({
          error: "Each image should be less than 1 MB",
        });
      }

      const imageData = {
        data: fs.readFileSync(image.path),
        contentType: image.mimetype,
      };

      propertyImg.push(imageData);
      i++;
    }

    // Parse and validate logo image
    let logoData = null;
    if (req.files?.singleLogo) {
      const singleLogo = req.files.singleLogo;
      if (singleLogo.size > 1000000) {
        return res.status(400).send({ error: "Logo should be less than 1 MB" });
      }

      logoData = {
        data: fs.readFileSync(singleLogo.path),
        contentType: singleLogo.mimetype,
      };
    }
    // Create new property instance with all data
    const newProperty = new PropertySchema({
      owner,
      address,
      additionalRooms,
      ageOfConstruction,
      carpetarea,
      developer,
      electricityStatus,
      facing,
      flooring,
      furnishing,
      floor,
      lifts,
      location,
      loanOffered,
      landmarks,
      layout,
      ownershipType,
      overlooking,
      priceBreakup,
      pricePerSqft,
      propClass,
      project,
      SellStartprice,
      status,
      totalFloors,
      transactionType,
      waterAvailability,
      sellOrLease,
      rentAmount,
      rentFrequency,
      propertyImg,
      singleLogo: logoData,
    });

    await newProperty.save();

    res.status(200).send({
      success: true,
      message: "Property added successfully",
      newProperty,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Internal server error", error });
  }
};

// get All Properties API
export const getAllProperties = async (req, res) => {
  try {
    const properties = await PropertySchema.find({});

    // convert image data to base64
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

    res.status(200).send({
      success: true,
      totalCount: propertiesWithImg.length,
      propertiesWithImg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error || error in get all properties API",
      error,
    });
  }
};

// get Property by ID API
export const getPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id;
    if (!propertyId) {
      return res.status(404).send({
        success: false,
        message: "Please provide Property ID",
      });
    }
    const property = await PropertySchema.findById(propertyId);

    if (!property) {
      return res.status(404).send({
        success: false,
        message: "Property not found",
      });
    }

    // convert image data to base64 for the single property
    const images = property.propertyImg.map((img) => ({
      data: img.data
        ? `data:${img.contentType};base64,${img.data.toString("base64")}`
        : null,
      contentType: img.contentType,
    }));

    const propertyWithImg = {
      ...property._doc,
      propertyImg: images,
    };

    res.status(200).send({
      success: true,
      totalCount: 1,
      propertyWithImg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error || error in get property by ID API",
      error,
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
    const interestedList = await InterestPropsModel.find({ ownerid: ownerId })
      .populate({
        path: "userId",
        select: "name email phone", // Only select the necessary fields
      })
      .populate({
        path: "propertyId",
        select: "project", // Only select the project name
      });

    // console.log(`Interested List: ${JSON.stringify(interestedList)}`);

    // Handle case where no interested users are found
    if (interestedList.length === 0) {
      console.warn("No interested users found for the given owner ID");
      return res.status(404).json({ message: "No interested users found" });
    }

    // Format the response to include user and property details
    const interestedUsers = interestedList.map((item) => ({
      userId: item.userId._id,
      name: item.userId.name,
      email: item.userId.email,
      phone: item.userId.phone,
      propertyId: item.propertyId._id,
      projectName: item.propertyId.project,
      interestedDate: item.createdAt,
    }));

    res.json({ success: true, interestedUsers });
  } catch (error) {
    console.error("Error in getInterestedUsersByOwnerId:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInterestedUsersByPorpId = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const interestedList = await Interested.find({ propertyId }).populate(
      "userId"
    );
    if (!interestedList) {
      return res.status(404).json({ message: "No interested users found" });
    }

    const interestedUsers = interestedList.map((item) => item.userId);
    res.json({ interestedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInterestedPropertiesForClient = async (req, res) => {
  try {
    const userId = req.userId;

    const interestedRecords = await InterestedSchema.find({ userId }).populate(
      "propertyId"
    );

    if (!interestedRecords || interestedRecords.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No interested properties found" });
    }

    const properties = interestedRecords.map((record) => record.propertyId);

    return res.status(200).json(properties);
  } catch (error) {
    console.error(`Error fetching interested properties for client: ${error}`);
    res.status(500).send({
      success: false,
      message:
        "Internal Server Error || Error in fetching interested properties",
    });
  }
};

// filter Properties API
export const filterProperties = async (req, res) => {
  try {
    const {
      layout,
      sellOrLease,
      status,
      ownershipType,
      location,
      addressLocation,
      minAge,
      maxAge,
      minPrice,
      maxPrice,
      minRentAmount,
      maxRentAmount,
      rentFrequency,
    } = req.query;

    // build the query object
    const query = {};

    if (layout) {
      query.layout = layout;
    }

    if (sellOrLease) {
      query.sellOrLease = sellOrLease;
    }

    if (status) {
      query.status = status;
    }

    if (ownershipType) {
      query.ownershipType = ownershipType;
    }

    if (location) {
      query.location = new RegExp(location, "i"); // Case-insensitive partial match
    }

    if (addressLocation) {
      query.address = {
        $elemMatch: { $regex: addressLocation, $options: "i" },
      }; // Case-insensitive partial match within address array
    }

    if (minAge && maxAge) {
      query.ageOfConstruction = { $gte: minAge, $lte: maxAge };
    } else if (minAge) {
      query.ageOfConstruction = { $gte: minAge };
    } else if (maxAge) {
      query.ageOfConstruction = { $lte: maxAge };
    }

    if (minPrice && maxPrice) {
      query.SellStartprice = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.SellStartprice = { $gte: minPrice };
    } else if (maxPrice) {
      query.SellStartprice = { $lte: maxPrice };
    }

    if (minRentAmount && maxRentAmount) {
      query.rentAmount = { $gte: minRentAmount, $lte: maxRentAmount };
    } else if (minRentAmount) {
      query.rentAmount = { $gte: minRentAmount };
    } else if (maxRentAmount) {
      query.rentAmount = { $lte: maxRentAmount };
    }

    if (rentFrequency) {
      query.rentFrequency = rentFrequency;
    }

    const filteredProperties = await PropertySchema.find(query);

    // convert image data to base64
    const propertiesWithImg = filteredProperties.map((property) => {
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

    res.status(200).send({
      success: true,
      totalCount: propertiesWithImg.length,
      propertiesWithImg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error || error in filter properties API",
      error,
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.userId;
    const updates = req.fields;

    // Check if property ID is valid
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Property ID is required",
      });
    }

    // Find the property
    const property = await PropertySchema.findById(id);
    if (!property) {
      return res.status(404).send({
        success: false,
        message: "Property not found",
      });
    }

    // Check ownership
    if (property.owner.toString() !== ownerId.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized to update this property",
      });
    }

    // Update fields based on provided updates
    Object.keys(updates).forEach((update) => {
      if (update !== "propertyImg" && update !== "singleLogo") {
        property[update] = updates[update];
      }
    });

    // Handle image updates if provided
    if (req.files?.propertyImages) {
      let updatedPropertyImages = [];
      let i = 0;
      while (req.files[`propertyImages[${i}]`]) {
        const image = req.files[`propertyImages[${i}]`];
        if (image.size > 1000000) {
          return res
            .status(400)
            .send({ error: "Each image should be less than 1 MB" });
        }

        // Ensure image data is valid
        if (!image.path || !image.type) {
          return res.status(400).send({ error: "Invalid image data" });
        }

        const imageData = {
          data: fs.readFileSync(image.path),
          contentType: image.type,
        };

        updatedPropertyImages.push(imageData);
        i++;
      }

      property.propertyImg = updatedPropertyImages;
    }

    // Handle logo update if provided
    if (req.files?.singleLogo) {
      const singleLogo = req.files.singleLogo;
      if (singleLogo.size > 1000000) {
        return res.status(400).send({ error: "Logo should be less than 1 MB" });
      }

      // Ensure logo data is valid
      if (!singleLogo.path || !singleLogo.type) {
        return res.status(400).send({ error: "Invalid logo data" });
      }

      const logoData = {
        data: fs.readFileSync(singleLogo.path),
        contentType: singleLogo.type,
      };

      property.singleLogo = logoData;
    }

    // Save the updated property
    await property.save();

    res.status(200).send({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.error("Error updating property:", error); // Log the error for debugging
    res.status(500).send({
      success: false,
      message: "Internal server error || error in update property API",
      error: error.message, // Send only the error message
    });
  }
};
// // delete Property API
// export const deleteProperty = async (req, res) => {
//   try {
//     const propertyId = req.params.id;
//     if (!propertyId) {
//       return res.status(404).send({
//         success: false,
//         message: "Please provide Property ID",
//       });
//     }
//     const property = await PropertySchema.findById(propertyId);
//     if (!property) {
//       return res.status(404).send({
//         success: false,
//         message: "Property not found",
//       });
//     }

//     await property.remove();

//     res.status(200).send({
//       success: true,
//       message: "Property deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error || error in delete property API",
//       error,
//     });
//   }

// };

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the property
    const deletedProperty = await PropertySchema.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).send({
        success: false,
        message: "Property not found",
      });
    }

    res.send({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error || error in delete property API",
      error,
    });
  }
};

export const approveProperty = async (req, res) => {
  try {
   const propertyId = req.params.id;
   if (!propertyId) {
     return res.status(404).send({
       success: false,
       message: "Please provide Property ID",
     });
   }
   const property = await PropertySchema.findById(propertyId);

   if (!property) {
     return res.status(404).send({
       success: false,
       message: "Property not found",
     });
   }

    property.isApproved = true;
    await property.save();

    res
      .status(200)
      .json({ success: true, message: "Property approved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to approve property", error });
  }
};
