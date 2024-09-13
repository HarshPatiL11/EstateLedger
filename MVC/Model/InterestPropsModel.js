  import mongoose from "mongoose";

  const interestedSchema = new mongoose.Schema(
    {
      ownerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      isApprove: {
        type: Boolean,
        default: false, // Default is not approved
      },
    },
    { timestamps: true }
  );

  export default mongoose.model("Interested", interestedSchema);
