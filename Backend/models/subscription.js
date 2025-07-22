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
    description: {
      type: String,
      required: [true, "Subscription description is required"],
      default: "A comprehensive subscription plan for your business needs"
    },
    maxCompanies: {
      type: Number,
      required: [true, "Maximum number of companies is required"],
      min: 1,
    },
    maxPhotos: {
      type: Number,
      default: 100,
    },
    maxUsers: {
      type: Number,
      default: 10,
    },
    period: {
      type: String, // Changed from Number to String: 'monthly', 'yearly', 'lifetime'
      // required: [true, "Subscription period is required"],
      enum: ['monthly', 'yearly', 'lifetime'],
      default: 'monthly'
    },
    periodInDays: {
      type: Number, // Keep the original period logic for backend calculations
      required: [true, "Period in days is required"],
      min: 1,
      default: 30
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      default: 5000,
    },
    originalPrice: {
      type: Number,
      default: null, // For discount calculations
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    features: {
      type: [String],
      default: [
        "Basic invoicing",
        "Customer management",
        "Email support",
        "Monthly reports"
      ]
    },
    // Promotional flags
    isPopular: {
      type: Boolean,
      default: false,
    },
    isBestOffer: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    flashSaleEndDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['true', 'false'],
      default: 'true',
      required: true,
    },
    superadminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "superadmin",
    },
  },
  { timestamps: true }
);

// Virtual for calculating savings
subscriptionSchema.virtual('savings').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Method to check if subscription is on sale
subscriptionSchema.methods.isOnSale = function() {
  return this.originalPrice && this.originalPrice > this.price;
};

// Method to check if flash sale is still active
subscriptionSchema.methods.isFlashSaleActive = function() {
  if (!this.isFlashSale || !this.flashSaleEndDate) return false;
  return new Date() < this.flashSaleEndDate;
};

module.exports = mongoose.model("Subscription", subscriptionSchema);
