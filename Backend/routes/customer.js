const express = require("express");
const router = express.Router();

const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createCustomer,
  getAllCustomers,
  getCustomersBySearch,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer");

// Routes for customers
router.route("/")
  .post(authorizeRoles(["admin", "user"]), createCustomer)
  .get(authorizeRoles(["admin", "user"]), getAllCustomers);
// router.route("/getbysearch").get(getCustomersBySearch);
router.route("/:id")
  .get(authorizeRoles(["admin", "user"]), getCustomer)
  .patch(authorizeRoles(["admin", "user"]), updateCustomer)
  .delete(authorizeRoles(["admin", "user"]), deleteCustomer);

module.exports = router;
