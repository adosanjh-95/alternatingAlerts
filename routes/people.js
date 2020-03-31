const express = require("express");
const router = express.Router();
const {
  getPeople,
  createPerson,
  deletePerson,
  updatePerson
} = require("../controllers/peopleController");

router.route("/").get(getPeople);

router.route("/").post(createPerson);

router.route("/:id").delete(deletePerson);

router.route("/:id").put(updatePerson);

module.exports = router;
