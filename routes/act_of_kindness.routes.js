const express = require("express");
const kindnessController = require("../controllers/kindessController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(kindnessController.getAllKindness)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    kindnessController.uploadKindnessPhoto,
    kindnessController.resizeKindnessPhoto,
    kindnessController.createKindness
  );

router
  .route("/:id")
  .get(kindnessController.getKindness)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    kindnessController.uploadKindnessPhoto,
    kindnessController.resizeKindnessPhoto,
    kindnessController.updateKindness
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    kindnessController.deleteKindness
  );

module.exports = router;
