const { SUBSCRIPTION_KEY } = require("../config");

const authenticateKeyMiddleware = (req, res, next) => {
  const subscriptionKey = req.get("subscriptionKey");

  if (!subscriptionKey || subscriptionKey !== SUBSCRIPTION_KEY) {
    res.status(401).json("Unauthorized");
    return;
  }
  next();
};

const unknownEndpointMiddleware = (req, res, next) => {
  res.status(404).json("Unknown endpoint");
};

module.exports = {
  authenticateKeyMiddleware,
  unknownEndpointMiddleware
};
