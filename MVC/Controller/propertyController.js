import fs from "fs";
import Property from "../Model/PropertyModel.js";

// add Property API
export const registerProperty = async (req, res) => {
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
      !sellStartPrice ||
      !status ||
      !totalFloors ||
      !transactionType ||
      !waterAvailability ||
      (sellOrLease === 'Lease' || sellOrLease === 'Both') && (!rentAmount || !rentFrequency) // Add this validation
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
    const properties = await Property.find({});

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

//filter Properties API
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


export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (property) {
      // Update fields if provided
      property.address = req.body.address || property.address;
      property.additionalRooms =
        req.body.additionalRooms || property.additionalRooms;
      property.ageOfConstruction =
        req.body.ageOfConstruction || property.ageOfConstruction;
      property.carpetarea = req.body.carpetarea || property.carpetarea;
      property.developer = req.body.developer || property.developer;
      property.electricityStatus =
        req.body.electricityStatus || property.electricityStatus;
      property.flooring = req.body.flooring || property.flooring;
      property.furnishing = req.body.furnishing || property.furnishing;
      property.floor = req.body.floor || property.floor;
      property.lifts = req.body.lifts || property.lifts;
      property.location = req.body.location || property.location;
      property.loanOffered = req.body.loanOffered || property.loanOffered;
      property.landmarks = req.body.landmarks || property.landmarks;
      property.layout = req.body.layout || property.layout;
      property.ownershipType = req.body.ownershipType || property.ownershipType;
      property.overlooking = req.body.overlooking || property.overlooking;
      property.priceBreakup = req.body.priceBreakup || property.priceBreakup;
      property.pricePerSqft = req.body.pricePerSqft || property.pricePerSqft;
      property.propClass = req.body.propClass || property.propClass;
      property.project = req.body.project || property.project;
      property.sellStartPrice =
        req.body.sellStartPrice || property.sellStartPrice;
      property.status = req.body.status || property.status;
      property.totalFloors = req.body.totalFloors || property.totalFloors;
      property.transactionType =
        req.body.transactionType || property.transactionType;
      property.waterAvailability =
        req.body.waterAvailability || property.waterAvailability;
      property.sellOrLease = req.body.sellOrLease || property.sellOrLease;

      // Update rentAmount and rentFrequency if applicable
      if (req.body.sellOrLease === "Lease" || req.body.sellOrLease === "Both") {
        if (req.body.rentAmount) {
          property.rentAmount = req.body.rentAmount;
        }
        if (req.body.rentFrequency) {
          property.rentFrequency = req.body.rentFrequency;
        }
      } else {
        property.rentAmount = undefined;
        property.rentFrequency = undefined;
      }

      
      if (req.files?.propertyImg) {
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
        property.propertyImg = propertyImg;
      }

      // Handle logo image
      if (req.files?.singleLogo) {
        const singleLogo = req.files.singleLogo;
        if (singleLogo.size > 1000000) {
          return res
            .status(400)
            .send({ error: "Logo should be less than 1 MB" });
        }

        property.singleLogo = {
          data: fs.readFileSync(singleLogo.path),
          contentType: singleLogo.type,
        };
      }

      // Save updated property
      const updatedProperty = await property.save();

      res.status(200).send({
        status: "success",
        message: "Property updated successfully",
        updatedProperty,
      });
    } else {
      res.status(404).send({
        status: "error",
        message: "Property not found",
      });
    }
  } catch (error) {
    console.error(`Error in API: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }
};




// delete Property APi
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
