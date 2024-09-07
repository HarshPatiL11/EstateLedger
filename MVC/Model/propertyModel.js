import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Property must have an owner"],
    },
    address: {
      type: String,
      required: [true, "Enter the address"],
    },
    additionalRooms: {
      type: [String],
    },
    ageOfConstruction: {
      type: String,
      required: [true, "Enter the age of construction"],
    },
    carpetarea: {
      type: Number,
      required: [true, "Enter the carpet area"],
    },
    developer: {
      type: String,
      required: [true, "Enter the developer's name"],
    },
    electricityStatus: {
      type: String,
      required: [true, "Enter the status of electricity"],
    },
    facing: {
      type: String,
      required: [true, "Enter the facing direction"],
      enum: ["East", "West", "North", "South"],
    },
    flooring: {
      type: [String],
      required: [true, "Enter flooring details"],
    },
    furnishing: {
      type: String,
      required: [true, "Enter furnishing details"],
      enum: ["Unfurnished", "Semi-Furnished", "Fully Furnished"],
    },
    floor: {
      type: String,
      required: [true, "Enter the floor number"],
    },
    lifts: {
      type: Number,
      required: [true, "Enter the number of lifts"],
    },
    location: {
      type: String,
      required: [true, "Enter the location"],
    }, //only local location
    loanOffered: {
      type: String,
    },
    landmarks: {
      type: String,
      required: [true, "Enter nearby landmarks"],
    },
    layout: {
      type: String,
      required: [true, "Enter the property layout"],
      enum: [
        "1 RK",
        "1 BHK",
        "1.5 BHK",
        "2 BHK",
        "2.5 BHK",
        "3 BHK",
        "3.5 BHK",
        "4 BHK",
        "4.5 BHK",
        "5 BHK",
        "5.5 BHK",
        "6 BHK",
        "7.5 BHK",
      ],
    },
    ownershipType: {
      type: String,
      required: [true, "Enter the type of ownership"],
      enum: ["Freehold", "Co-operative Society", "Leasehold"],
    },
    overlooking: {
      type: [String],
      required: [true, "Enter what the property overlooks"],
    },
    priceBreakup: {
      type: String,
      required: [true, "Enter the price breakup details"],
    },
    pricePerSqft: {
      type: Number,
      required: [true, "Enter the price per square foot"],
    },
    propClass: {
      type: String,
      required: [true, "Enter the property class"],
      enum: [
        "Apartment",
        "House",
        "Bungalow",
        "Villa",
        "Row House",
        "Studio Apartment",
      ],
    },
    project: {
      type: String,
      required: [true, "Enter the project name"],
    },
    SellStartprice: {
      type: Number,
      required: [true, "Enter the selling price"],
    },
    status: {
      type: String,
      required: [true, "Enter the status"],
      enum: ["Under Construction", "Ready to Move"],
    },
    totalFloors: {
      type: Number,
      required: [true, "Enter the total number of floors"],
    },
    transactionType: {
      type: String,
      required: [true, "Enter the transaction type"],
      enum: ["New", "Resale"],
    },
    waterAvailability: {
      type: String,
      required: [true, "Enter water availability details"],
    },
    sellOrLease: {
      type: String,
      enum: ["Sell", "Lease", "Both"],
      required: [true, "Enter whether the owner wants to sell, lease, or both"],
    },
    rentAmount: {
      type: Number,
      required: function () {
        return this.sellOrLease === "Lease" || this.sellOrLease === "Both";
      },
      validate: {
        validator: function (value) {
          // Ensure rentAmount is a number and greater than 0 when required
          return this.sellOrLease === "Lease" || this.sellOrLease === "Both"
            ? typeof value === "number" && !isNaN(value) && value > 0
            : true;
        },
        message: "Rent amount must be greater than 0 when selling or leasing.",
      },
    },
    rentFrequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Yearly"],
      required: function () {
        return this.sellOrLease === "Lease" || this.sellOrLease === "Both";
      },
      validate: {
        validator: function (value) {
          // Ensure rentFrequency is valid enum value when required
          return this.sellOrLease === "Lease" || this.sellOrLease === "Both"
            ? value === "Monthly" || value === "Quarterly" || value === "Yearly"
            : true;
        },
        message:
          "Rent frequency is required and must be a valid enum value when selling or leasing.",
      },
    },

    propertyImg: [
      {
        data: {
          type: Buffer,
          required: false,
        },
        contentType: {
          type: String,
          required: false,
        },
      },
    ],
    singleLogo: {
      data: {
        type: Buffer,
        required: false,
      },
      contentType: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);


// Custom validation to ensure rentAmount and rentFrequency are both present if either is required
PropertySchema.pre('validate', function (next) {
  if ((this.sellOrLease === "Lease" || this.sellOrLease === "Both") &&
      (!this.rentAmount || !this.rentFrequency)) {
    this.invalidate('rentAmount', 'Rent amount and frequency are required when leasing or both');
    this.invalidate('rentFrequency', 'Rent amount and frequency are required when leasing or both');
  }
  next();
});

export default mongoose.model("Property", PropertySchema);
