const express = require("express");
const districtwiseworkController = require("../controllers/districtOurWorkController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(districtwiseworkController.getAllWork)
  .post(
    districtwiseworkController.uploadWorkImages,
    districtwiseworkController.resizeWorkImages,
    districtwiseworkController.createOurWork
  );

router
  .route("/:id")
  .get(districtwiseworkController.getSingleWork)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    districtwiseworkController.uploadWorkImages,
    districtwiseworkController.resizeWorkImages,
    districtwiseworkController.updateSingleWork
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    districtwiseworkController.deleteSingleWork
  );

module.exports = router;
