import express from "express";
import {
  filterProperties,
  getAllProperties,
  getPropertyById,
} from "../Controller/propertyController.js";

const propertyRouter = express.Router();

// property filter
propertyRouter.post("/filter", filterProperties);

// property get
propertyRouter.get("/all", getAllProperties);
propertyRouter.get("/:id", getPropertyById);

export default propertyRouter;
