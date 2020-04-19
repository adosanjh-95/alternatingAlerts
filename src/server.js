const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("../db");
const peopleRouter = require("../routes/people");
const userRouter = require("../routes/user");
const {
  authenticationMiddleware,
  unknownEndpointMiddleware
} = require("../middleware");

dotenv.config({ path: "./.env" });

connectDB();

const app = express();
app.use(helmet());

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Welcome to my test app`);
});

app.use("/user", userRouter);
app.use(authenticationMiddleware);
app.use("/people", peopleRouter);
app.use(unknownEndpointMiddleware);

module.exports = app;
