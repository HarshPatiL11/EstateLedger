import RatingModel from "../Model/RatingModel.js";

// Add a review
export const addReview = async (req, res) => {
  const { rating } = req.body;
  const userId = req.userId;
  const propertyId = req.params.id;

  // Validate incoming data
  if (!rating || !userId || !propertyId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be a number between 1 and 5",
    });
  }

  try {
    // Check if a review already exists for the given user and property
    const existingReview = await RatingModel.findOne({ propertyId, userId });
    if (existingReview) {
      // Update the existing review
      existingReview.rating = rating;
      await existingReview.save();
      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review: existingReview,
      });
    }

    // Create a new review
    const newReview = await RatingModel.create({
      propertyId,
      userId,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRatingByUserForProperty = async (req, res) => {
  const { propertyId } = req.params.id;
  const userId = req.userId;

  try {
    const rating = await RatingModel.findOne({ propertyId, userId }); // Use lean() for plain JavaScript objects

    if (!rating) {
      return res
        .status(404)
        .json({ success: false, message: "Rating not found" });
    }

    res.status(200).json({
      success: true,
      rating: {
        propertyId: rating.propertyId,
        userId: rating.userId,
        rating: rating.rating,
        _id: rating._id,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a property
export const getReviewByProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const reviews = await RatingModel.find({ propertyId }).populate(
      "userId",
      "name email"
    );
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAverageRating = async (req, res) => {
  const { propertyId } = req.params.id;

  try {
    // Find all ratings for the property
    const ratings = await RatingModel.find({ propertyId });

    if (ratings.length === 0) {
      return res.status(200).json({
        success: true,
        totalRatings: 0,
        averageRating: 0,
      });
    }

    const totalRatings = ratings.length;
    const averageRating =
      ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;

    res.status(200).json({
      success: true,
      totalRatings,
      averageRating: parseFloat(averageRating.toFixed(2)), // Format average rating to 2 decimal places
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};