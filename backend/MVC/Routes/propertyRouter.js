import express from "express";
import {
  filterProperties,
  getAllProperties,
  getPropertyById,
} from "../Controller/propertyController.js";
import { expressInterest } from "../Controller/ExpressInterest.js";
import { authMiddle } from "../Middleware/AuthMiddleware.js";
import {
  getRatingByUserForProperty,
  getAverageRating,
  createRating,
} from "../Controller/RatingController.js";

const propertyRouter = express.Router();

// property filter
propertyRouter.get("/filter", filterProperties);

// property get
propertyRouter.get("/all", getAllProperties);
propertyRouter.get("/:id", getPropertyById);

// interest in Prop
propertyRouter.post("/interested", authMiddle, expressInterest);

// rating routes
propertyRouter.post("/:id/addRating", authMiddle, createRating);
propertyRouter.get(
  "/:id/getUserRating",
  authMiddle,
  getRatingByUserForProperty
);
propertyRouter.get("/:id/getAvgRating", getAverageRating);

export default propertyRouter;
