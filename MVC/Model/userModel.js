import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      default: "client",
      enum: ["client", "owner", "admin"],
    },
    name: {
      type: String,
      required: [true, "Enter Your Name"],
    },
    email: {
      type: String,
      required: [true, "Enter Your Email ID"],
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Enter Your Password"],
    },
    frgtKey: {
      type: String,
    },
    profile: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
