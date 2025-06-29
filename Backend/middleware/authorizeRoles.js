const { UnauthenticatedError } = require("../errors");

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new UnauthenticatedError("Not authorized to access this route");
    }
    next();
  };
};

module.exports = authorizeRoles;
// This middleware checks if the user's role is included in the allowed roles.
// If not, it throws an UnauthenticatedError.
