const express = require("express");
const app = express();
const PORT = 8080; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
