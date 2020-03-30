const people = [{ name: "Test person" }];

exports.getPeople = (req, res, next) => {
  res.send(people);
};
