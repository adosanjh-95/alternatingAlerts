const express = require("express");
const router = express.Router();
const { getPeople, createPerson } = require("../controllers/peopleController");

router.route("/").get(getPeople);

router.route("/").post(createPerson);

module.exports = router;
