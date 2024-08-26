import express from 'express'
import { deleteProperty, filterProperties, getAllProperties, getPropertyById, registerProperty } from '../Controller/propertyController';
import { ownerMiddleware } from "../Middleware/AdminMiddleware";

const propertyRouter =express.Router();

// create property
propertyRouter.post("/register", ownerMiddleware, registerProperty);

// property filter 
propertyRouter.post('/filter',filterProperties);

// property get 
propertyRouter.get('/property/all',getAllProperties)
propertyRouter.get("/property/:id", getPropertyById);

// property delete 
propertyRouter.delete("/delete/:id", ownerMiddleware, deleteProperty);

export default propertyRouter;