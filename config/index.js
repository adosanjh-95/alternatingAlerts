//Don't load the .env variables if production - inject directly from Heroku
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: "./.env" });
}

const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;
const PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
} else if (process.env.NODE_ENV === "development") {
  MONGODB_URI = process.env.DEV_MONGODB_URI;
}

module.exports = {
  SUBSCRIPTION_KEY,
  PORT,
  MONGODB_URI
};
