const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../db");
const people = require("../routes/people");

dotenv.config({ path: "./.env" });

connectDB();

const app = express();

const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;

const authenticateKeyMiddleware = (req, res, next) => {
  const subscriptionKey = req.get("subscriptionKey");

  if (!subscriptionKey || subscriptionKey !== SUBSCRIPTION_KEY) {
    res.send("Unauthorized");
    return;
  }
  next();
};

app.use(authenticateKeyMiddleware);
app.use(express.json());
app.use("/people", people);

const PORT = process.env.PORT;

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send(`Hello world`);
});

// start the Express server
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
