import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";
import UserSchema from "../Model/userModel.js"; 

export const authMiddle = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    jwt.verify(token, JWT_SECRET, async (err, decode) => {
      if (err) {
        console.log("JWT verification error:", err);
        return res.status(401).send({
          success: false,
          message: "Unauthorized User",
        });
      }

      // Validate user in database
      const user = await UserSchema.findById(decode.id);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      req.userId = decode.id;
      req.userType = user.userType; // Ensure this matches your field name
      console.log("Decoded JWT:", decode);
      console.log("User Type from DB:", req.userType);

      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ERROR in API",
      error,
    });
  }
};
