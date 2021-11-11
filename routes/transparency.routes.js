const express = require("express");
const transparencyController = require("../controllers/transparencyController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(transparencyController.getAllTransparency)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    transparencyController.uploadTransparencyPhoto,
    transparencyController.resizeTransparencyPhoto,
    transparencyController.createTransparency
  );

router
  .route("/:id")
  .get(transparencyController.getTransparency)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    transparencyController.uploadTransparencyPhoto,
    transparencyController.resizeTransparencyPhoto,
    transparencyController.updateTransparency
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    transparencyController.deleteTransparency
  );

module.exports = router;
