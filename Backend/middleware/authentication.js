const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid !!!");
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        tokenID: payload.tokenID,
        name: payload.name,
        role: payload.role,
        adminID: payload.adminID ?? null,
        companyID: payload.companyID ?? null,
      };
      next();
    } catch (error) {
      throw new UnauthenticatedError("Not Allowed to access this route.");
    }
  }
};

module.exports = authenticationMiddleware;
