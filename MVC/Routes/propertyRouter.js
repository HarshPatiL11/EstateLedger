import express from "express";
import {
  filterProperties,
  getAllProperties,
  getPropertyById,
} from "../Controller/propertyController";

const propertyRouter = express.Router();

// property filter
propertyRouter.post("/filter", filterProperties);

// property get
propertyRouter.get("/property/all", getAllProperties);
propertyRouter.get("/property/:id", getPropertyById);

export default propertyRouter;
