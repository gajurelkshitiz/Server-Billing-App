const Subscription = require("../models/subscription");
const { BadRequestError, UnauthenticatedError, notFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");

const createSubscription = async (req, res) => {
  const { 
    name, 
    description,
    maxCompanies, 
    price, 
    originalPrice,
    discountPercentage,
    // period,
    periodInDays,
    features,
    isPopular,
    isBestOffer,
    isFlashSale,
    flashSaleEndDate,
    status 
  } = req.body;

  if (!name || !description || !maxCompanies || !periodInDays) {
    throw new BadRequestError("Please provide all required values");
  }

  // Auto-calculate discount percentage if not provided but originalPrice exists
  if (originalPrice && !discountPercentage && originalPrice > price) {
    req.body.discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  req.body.superadminID = req.user.tokenID;
  const subscription = await Subscription.create({ ...req.body });

  // Path to the dictionary file
  const dictPath = path.join(__dirname, "../constants/subscriptionDict.json");

  // Read existing dictionary or start with empty object
  let subscriptionDict = {};
  if (fs.existsSync(dictPath)) {
    subscriptionDict = JSON.parse(fs.readFileSync(dictPath, "utf-8"));
  }

  // Add or update the new subscription
  subscriptionDict[subscription.name] = subscription._id;

  // Write updated dictionary back to file
  fs.writeFileSync(dictPath, JSON.stringify(subscriptionDict, null, 2));

  res.status(StatusCodes.CREATED).json({ 
    success: true,
    message: "Subscription created successfully",
    subscription, 
    subscriptionDict 
  });
};

const getAllSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find({}).sort("createdAt");
  res
    .status(StatusCodes.OK)
    .json({ 
      success: true,
      subscriptions, 
      count: subscriptions.length 
    });
};

// New endpoint for frontend subscription available page
const getAvailableSubscriptions = async (req, res) => {
  try {
    // Get only active subscriptions and filter out expired flash sales
    const subscriptions = await Subscription.find({ 
      status: 'active' 
    }).sort([
      ['isFlashSale', -1],  // Flash sales first
      ['isBestOffer', -1],  // Best offers next
      ['isPopular', -1],    // Popular plans next
      ['price', 1]          // Then by price ascending
    ]);

    // Filter out expired flash sales
    const activeSubscriptions = subscriptions.filter(sub => {
      if (sub.isFlashSale && sub.flashSaleEndDate) {
        return new Date() < sub.flashSaleEndDate;
      }
      return true;
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Available subscriptions fetched successfully",
      data: activeSubscriptions,
      count: activeSubscriptions.length
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch available subscriptions",
      error: error.message
    });
  }
};

const getSubscription = async (req, res) => {
  const {
    params: { id: subscriptionID },
  } = req;

  const subscription = await Subscription.findOne({
    _id: subscriptionID,
  });

  if (!subscription) {
    throw new notFoundError(`No Subscription with id: ${subscriptionID}`);
  }

  res.status(StatusCodes.OK).json({ subscription });
};

const updateSubscription = async (req, res) => {
  const {
    params: { id: subscriptionID },
    body: { 
      name, 
      description,
      maxCompanies, 
      price, 
      originalPrice,
      discountPercentage,
      period,
      periodInDays,
      features,
      isPopular,
      isBestOffer,
      isFlashSale,
      flashSaleEndDate,
      status 
    },
  } = req;

  if (name === "" || maxCompanies === "" || price === "" || period === "") {
    throw new BadRequestError("Required fields cannot be empty");
  }

  // Auto-calculate discount percentage if not provided but originalPrice exists
  if (originalPrice && !discountPercentage && originalPrice > price) {
    req.body.discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const subscription = await Subscription.findOneAndUpdate(
    { _id: subscriptionID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!subscription) {
    throw new notFoundError(`No Subscription Found with id: ${subscriptionID}`);
  }
  
  res.status(StatusCodes.OK).json({ 
    success: true,
    message: "Subscription updated successfully",
    subscription 
  });
};

// New endpoint for purchasing subscriptions
const purchaseSubscription = async (req, res) => {
  try {
    const { subscriptionId, paymentMethod, companyId } = req.body;
    
    if (!subscriptionId || !paymentMethod) {
      throw new BadRequestError("Subscription ID and payment method are required");
    }

    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new notFoundError("Subscription not found");
    }

    if (subscription.status !== 'active') {
      throw new BadRequestError("This subscription is not available for purchase");
    }

    // Check if flash sale is still valid
    if (subscription.isFlashSale && subscription.flashSaleEndDate) {
      if (new Date() > subscription.flashSaleEndDate) {
        throw new BadRequestError("Flash sale has expired");
      }
    }

    // Here you would integrate with your payment processor
    // For now, we'll simulate a successful purchase
    
    // Calculate expiry date based on period
    const expiryDate = new Date();
    if (subscription.periodInDays) {
      expiryDate.setDate(expiryDate.getDate() + subscription.periodInDays);
    }

    // You would create a purchase record here
    const purchaseData = {
      purchaseId: new Date().getTime().toString(), // Generate proper ID
      subscriptionId: subscription._id,
      userId: req.user.tokenID,
      amount: subscription.price,
      paymentMethod,
      status: 'completed',
      purchaseDate: new Date(),
      expiryDate: expiryDate
    };

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Subscription purchased successfully",
      data: purchaseData
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to purchase subscription"
    });
  }
};

// delete subscription huncha ki nai?
// active/inactive

// 3 mahina --> user existing

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getAvailableSubscriptions,
  getSubscription,
  updateSubscription,
  purchaseSubscription,
};
