const mongoose = require("mongoose");
const { SUBSCRIPTION_NAMES } = require("../constants/subscriptionNames");

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      // enum: SUBSCRIPTION_NAMES , // You can expand this as needed
      unique: true,
    },
    maxCompanies: {
      type: Number,
      required: [true, "Maximum number of companies is required"],
      min: 1,
    },
    maxPhotos: {
      type: Number,
    },
    maxUsers: {
      type: Number,
    },
    period: {
      type: Number, // in days
      required: [true, "Subscription period is required"],
      min: 1,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      default: 5000,
    },
    status: {
      type: Boolean,
      default: [true, "Subscription status is required"],
    },
    superadminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "superadmin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
