const express = require("express");
const donationController = require("../controllers/donationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/userdonations")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    donationController.createDonation
  )
  .get(
    authController.protect,
    authController.restrictTo("user"),
    donationController.getMyDonation
  );

router.route("/").get(donationController.index).post(donationController.store);
router.route("/:id").get(donationController.getDonation);

module.exports = router;
