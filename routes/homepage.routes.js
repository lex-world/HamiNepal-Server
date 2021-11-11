const express = require("express");

const home_pageController = require("./../controllers/home_pageController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(home_pageController.getContent)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    home_pageController.uploadHomeVideo,
    home_pageController.locateVideo,
    home_pageController.createHomepage
  );

router
  .route("/:id")

  .put(
    authController.protect,
    authController.restrictTo("admin"),
    home_pageController.uploadHomeVideo,
    home_pageController.locateVideo,
    home_pageController.updateSingleContent
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    home_pageController.deleteSingleContent
  );

module.exports = router;
