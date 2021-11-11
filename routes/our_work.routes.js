const express = require("express");
const ourWorkController = require("../controllers/ourWorkController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(ourWorkController.getAllWork)
  .post(
    ourWorkController.uploadWorkImages,
    ourWorkController.resizeWorkImages,
    ourWorkController.createOurWork
  );

router
  .route("/:id")
  .get(ourWorkController.getSingleWork)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    ourWorkController.uploadWorkImages,
    ourWorkController.resizeWorkImages,
    ourWorkController.updateSingleWork
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    ourWorkController.deleteSingleWork
  );

module.exports = router;
