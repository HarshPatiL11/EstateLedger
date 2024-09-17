import Rating from "../Model/RatingModel.js";
import mongoose from "mongoose";

export const createRating = async (req, res) => {
  const userId = req.userId; // Assuming userId is obtained from authentication middleware
  const propertyId = req.params.id; // Extract propertyId from route parameters
  const { rating } = req.body;
  console.log(
    "userId :",
    userId,
    " PropertyId :",
    propertyId,
    "and rated :",
    rating
  );

  // Validate input
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "Rating must be a number between 1 and 5" });
  }

  try {
    // Check if the user has already rated the same property
    const existingRating = await Rating.findOne({ propertyId, userId });

    if (existingRating) {
      console.log("found entry for user",userId,", prop ",propertyId,", old rating :-",existingRating);
      return res
        .status(404)
        .json({ message: "User has already rated this property" });
    }
    // Create and save the new rating
    const newRating = new Rating({ propertyId, userId, rating });
    console.log(newRating);
    
    await newRating.save();

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRatingByUserForProperty = async (req, res) => {
  const userId = req.userId; // Assuming userId is obtained from authentication middleware
  const propertyId = req.params.id; // Extract propertyId from route parameters
  console.log(
    "checking and geting User(",
    userId,
    ") Rating for property:-",
    propertyId
  );
  // Validate propertyId
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Fetch the rating for the specified property given by the specified user
    const rating = await Rating.findOne({ propertyId, userId }).populate(
      "userId",
      "name"
    );

    if (!rating) {
  console.log(
    "checking and geting User(",
    userId,
    ") Rating for property:-",
    propertyId,"found no rating"
  );

      return res
        .status(404)
        .json({ message: "No rating found for this property by this user" });
    }
    console.log(rating)
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAverageRating = async (req, res) => {
  const propertyId = req.params.id; // Extract propertyId from route parameters
console.log("geting the avg for the prop:-", propertyId);

  // Validate propertyId
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    // Fetch all ratings for the specified property
    const ratings = await Rating.find({ propertyId });
console.log("got the avg for the prop:-", propertyId,"equals to ", ratings);

    // If no ratings are found, return a 404 status
    if (ratings.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings found for this property" });
    }

    // Calculate the average rating
    const totalRatings = ratings.length;
    console.log(totalRatings, "is the total amounts of review,");
    
    const sumOfRatings = ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    console.log(sumOfRatings, "is the total sum of review,");

    const averageRating = sumOfRatings / totalRatings;
console.log("ang avg is",averageRating);

    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
