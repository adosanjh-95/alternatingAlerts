const People = require("../models/People");

exports.getPeople = async (req, res, next) => {
  try {
    const people = await People.find();
    res.status(200).json({
      success: true,
      count: people.length,
      data: people
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err
    });
  }
};

exports.createPerson = async (req, res, next) => {
  try {
    const person = await People.create(req.body);

    return res.status(201).json({
      success: true,
      data: person
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: "Server error"
    });
  }
};
