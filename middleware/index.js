const { SUBSCRIPTION_KEY } = require("../config");
const { verify } = require("jsonwebtoken");

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

  try {
    verify(token, SUBSCRIPTION_KEY);
    next();
  } catch (err) {
    let message = "Authentication failed - invalid token";

    if (err.name === "TokenExpiredError") {
      message = "Authentication failed - token expired";
    }

    return res.status(401).json(message);
  }
};

const unknownEndpointMiddleware = (req, res, next) => {
  res.status(404).json("Unknown endpoint");
};

module.exports = {
  authenticationMiddleware,
  unknownEndpointMiddleware
};
