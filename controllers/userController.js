const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res, next) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const existingUser = await User.find({ username });

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json(`Username ${username} is already in use - please choose another`);
    }

    const newUser = new User({
      username,
      passwordHash
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      data: { username }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: err
    });
  }
};
