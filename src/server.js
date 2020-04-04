const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../db");
const peopleRouter = require("../routes/people");
const {
  authenticateKeyMiddleware,
  unknownEndpointMiddleware
} = require("../middleware");

dotenv.config({ path: "./.env" });

connectDB();

const app = express();

app.use(authenticateKeyMiddleware);
app.use(express.json());
app.use("/people", peopleRouter);
app.use(unknownEndpointMiddleware);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send(`Hello world`);
});

module.exports = app;
