const User = require("../models/User");
const bcrypt = require("bcrypt");
const { SUBSCRIPTION_KEY } = require("../config");

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

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      const correctPassword = await bcrypt.compare(password, user.passwordHash);
      if (correctPassword) {
        return res.status(200).json({
          username,
          accessKey: SUBSCRIPTION_KEY
        });
      } else {
        return res
          .status(400)
          .json("The user/password combination was incorrect");
      }
    } else {
      return res
        .status(404)
        .json(`A user with username ${username} was not found`);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errors: err
    });
  }
};
