const Subscription = require("../models/subscription");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");

const createSubscription = async (req, res) => {
  const { name, maxCompanies, price, period, status } = req.body;
  if (!name || !maxCompanies || !price || !period || !status) {
    throw new BadRequestError("Please provide all values");
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

  res.status(StatusCodes.CREATED).json({ subscription, subscriptionDict });
};

const getAllSubscriptions = async (req, res) => {
  const subscriptions = await Subscription.find({}).sort("createdAt");
  res
    .status(StatusCodes.OK)
    .json({ subscriptions, count: subscriptions.length });
};

const getSubscription = async (req, res) => {
  const {
    params: { id: subscriptionID },
  } = req;

  const subscription = await Subscription.findOne({
    _id: subscriptionID,
  });

  if (!subscription) {
    throw new NotFoundError(`No Subscription with id: ${subscriptionID}`);
  }

  res.status(StatusCodes.OK).json({ subscription });
};

const updateSubscription = async (req, res) => {
  const {
    params: { id: subscriptionID },
    body: { name, maxCompanies, price, period, active },
  } = req;

  if (name === "" || maxCompanies === "" || price === "" || period === "") {
    throw new BadRequestError("All fields cannot be empty");
  }
  const subscription = await Subscription.findOneAndUpdate(
    { _id: subscriptionID },
    req.body,
    { new: true, runValidators: true }
  );

  if (!subscription) {
    throw new NotFoundError(`No Subscription Found with id: ${subscriptionID}`);
  }
  res.status(StatusCodes.OK).json({ subscription });
};

// delete subscription huncha ki nai?
// active/inactive

// 3 mahina --> user existing

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscription,
  updateSubscription,
};
