const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/authorizeRoles");

const { SUBSCRIPTION_NAMES } = require('../constants/subscriptionNames');

const {
  createSubscription,
  getAllSubscriptions,
  getSubscription,
  updateSubscription,
} = require("../controllers/subscription");


router.route("/").post(authorizeRoles(["superadmin"]), createSubscription);
router
  .route("/")
  .get(authorizeRoles(["superadmin", "admin"]), getAllSubscriptions);
router
  .route("/:id")
  .get(authorizeRoles(["superadmin", "admin"]), getSubscription)
  .patch(authorizeRoles(["superadmin"]),updateSubscription);


router.get('/name/types', (req, res) => {
  // Return the subscription names
  res.json(SUBSCRIPTION_NAMES);

});



module.exports = router;
