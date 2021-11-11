const express = require("express");
const emailVolContoller = require("../controllers/volunteer_email");

const router = express.Router();

router.route("/:city").get(emailVolContoller.emailVolunteer);

module.exports = router;
