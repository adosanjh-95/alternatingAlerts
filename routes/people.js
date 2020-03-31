const express = require("express");
const router = express.Router();
const {
  getPeople,
  createPerson,
  deletePerson
} = require("../controllers/peopleController");

router.route("/").get(getPeople);

router.route("/").post(createPerson);

router.route("/:id").delete(deletePerson);

module.exports = router;
