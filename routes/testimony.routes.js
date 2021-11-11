const express = require("express");
const authController = require("../controllers/authController");
const testimonyController = require("../controllers/testimonyController");


const router = express.Router();

router
  .route("/")
  .get(testimonyController.getAllTestimony)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    testimonyController.createTestimony
  );

router
  .route("/:id")
  .get(testimonyController.getTestimony)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    testimonyController.updateTestimony
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    testimonyController.deleteTestimony
  );

module.exports = router;
