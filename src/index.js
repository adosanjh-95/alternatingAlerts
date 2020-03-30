const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const people = require("../routes/people");

const app = express();

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
