const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add a username"]
  },
  passwordHash: {
    type: String,
    require: [true, "Please enter a password"]
  }
});

module.exports = mongoose.model("User", UserSchema);
