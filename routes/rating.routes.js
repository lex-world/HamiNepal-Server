const express = require("express");

const ratingController = require("../controllers/ratingController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(ratingController.getAllRating)
  .post(ratingController.createRating);

router
  .route("/:id")
  .get(ratingController.getRating)
  .put(ratingController.updateRating)
  .delete(authController.protect, ratingController.deleteRating);

module.exports = router;
