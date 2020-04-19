const User = require("../models/User");
const { compare, hash } = require("bcrypt");
const { SUBSCRIPTION_KEY } = require("../config");
const { sign } = require("jsonwebtoken");

exports.registerUser = async (req, res, next) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  try {
    const passwordHash = await hash(password, saltRounds);

    const existingUser = await User.find({ username });

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json(`Username ${username} is already in use - please choose another`);
    }

    await User.create({ username, passwordHash });

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
      const correctPassword = await compare(password, user.passwordHash);
      if (correctPassword) {
        const userForToken = {
          username: user.username,
          id: user._id
        };

        const accessToken = sign(userForToken, SUBSCRIPTION_KEY, {
          expiresIn: "15m"
        });

        return res.status(200).json({
          username,
          accessToken
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
    return res.status(500).json({
      success: false,
      errors: err
    });
  }
};
