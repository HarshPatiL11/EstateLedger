import fs from "fs";
import Property from "../Models/PropertyModel.js";

// add Property API
export const createProperty = async (req, res) => {
  try {
    const {
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
      sellStartPrice,
      status,
      totalFloors,
      transactionType,
      waterAvailability,
      sellOrLease,
    } = req.fields;

    // Validate required fields
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
      !sellStartPrice ||
      !status ||
      !totalFloors ||
      !transactionType ||
      !waterAvailability ||
      !sellOrLease
    ) {
      return res.status(400).send({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    // Parse and validate property images
    const propertyImg = [];
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
        contentType: image.type,
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
        contentType: singleLogo.type,
      };
    }

    // Create new property instance with all data
    const newProperty = new Property({
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
      sellStartPrice,
      status,
      totalFloors,
      transactionType,
      waterAvailability,
      sellOrLease,
      propertyImg, // Include the images array
      singleLogo: logoData, // Include the logo data
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
// get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({});

    // Convert image data to base64
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
    const propertyId = req.params._id;
    if (!propertyId) {
      return res.status(404).send({
        success: false,
        message: "Please provide Property ID",
      });
    }
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).send({
        success: false,
        message: "Property not found",
      });
    }

    // Convert image data to base64 for the single property
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

    res.status(200).json({
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

//filter api
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

    // Build the query object
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

    const properties = await Property.find(query);

    // Convert image data to base64
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

// Delete Property APi
export const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    if (!propertyId) {
      return res.status(404).send({
        success: false,
        message: "Please provide Property ID",
      });
    }
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).send({
        success: false,
        message: "Property not found",
      });
    }
    await property.deleteOne();
    res.status(200).send({
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
