const jwt = require("jsonwebtoken");
require("dotenv").config();

const genertateToken = (id, name, role, mode, adminID = null, companyID = null) => {
  const payload = {
    tokenID: id,
    name: name,
    role: role,
    mode: mode
  }
  // Add adminID and companyID for users
  if (role === "user" && adminID && companyID) {
    payload.adminID = adminID;
    payload.companyID = companyID;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

module.exports = genertateToken;
