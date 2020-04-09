const { SUBSCRIPTION_KEY } = require("../config");
const jwt = require("jsonwebtoken");

const AUTHORIZATION_HEADER = "authorization";

const authenticationMiddleware = (req, res, next) => {
  const authorization = req.get(AUTHORIZATION_HEADER);

  if (!authorization) {
    return res
      .status(401)
      .json("Authentication failed - an authorization token must be provided");
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json("Authentication failed - a valid bearer token must be provided");
  }

  jwt.verify(token, SUBSCRIPTION_KEY, function (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json("Authentication failed - token expired");
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json("Authentication failed - invalid token");
      }
    }
    next();
  });
};

const unknownEndpointMiddleware = (req, res, next) => {
  res.status(404).json("Unknown endpoint");
};

module.exports = {
  authenticationMiddleware,
  unknownEndpointMiddleware
};
