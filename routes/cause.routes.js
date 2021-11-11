const express = require("express");
const causeController = require("../controllers/causeController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(causeController.getAllCauses)
  .post(
    authController.protect,
    authController.restrictToBoth("admin", "user"),
    causeController.uploadCausePhoto,
    causeController.resizeCausePhoto,
    causeController.createCause
  );

router
  .route("/:id")
  .get(causeController.getCause)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    causeController.uploadCausePhoto,
    causeController.resizeCausePhoto,
    causeController.updateCause
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    causeController.deleteCause
  );

router
  .route("/approval/:id")
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    causeController.causeApproval
  );

module.exports = router;
