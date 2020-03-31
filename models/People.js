const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name for your user"]
  }
});

module.exports = mongoose.model("Person", PersonSchema);
