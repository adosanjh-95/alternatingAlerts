const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;
const PORT = process.env.PORT;

module.exports = {
  SUBSCRIPTION_KEY,
  PORT
};
