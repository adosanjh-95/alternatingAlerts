const people = [{ name: "Test person" }];

exports.getPeople = (req, res, next) => {
  res.send(people);
};

exports.createPerson = (req, res, next) => {
  res.send("Post endpoint");
};
