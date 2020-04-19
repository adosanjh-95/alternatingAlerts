const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../db");
const peopleRouter = require("../routes/people");
const userRouter = require("../routes/user");
const {
  authenticationMiddleware,
  unknownEndpointMiddleware
} = require("../middleware");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {
  swaggerDocsOptions,
  documentationPath
} = require("../docs/swaggerConfig");

dotenv.config({ path: "./.env" });

connectDB();

const app = express();

const swaggerSpec = swaggerJSDoc(swaggerDocsOptions);
app.use(documentationPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Welcome to my test app`);
});

app.use("/user", userRouter);
app.use(authenticationMiddleware);
app.use("/people", peopleRouter);
app.use(unknownEndpointMiddleware);

module.exports = app;
