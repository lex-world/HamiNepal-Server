const express = require("express");
const queryController = require("../controllers/queryController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/causes/totalDonations").get(
  // authController.protect,
  // authController.restrictTo("admin"),
  queryController.causeDonationAmount
);
router
  .route("/events/totalDonations")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.eventDonationAmount
  );

// router
//   .route("/causes/totalDonations")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin"),
//     queryController.eventDonationAmount
//   );
router
  .route("/events/topdonar")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.topEventDonar
  );

router
  .route("/causes/topdonar")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.topCauseDonar
  );

router
  .route("/allevents/totaldonation")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.allEventDonationAmount
  );

router
  .route("/totalDonations")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.totalDonation
  );

router.route("/average/rating").get(queryController.getAverageRating);

router
  .route("/volunteers/state")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.stateVolunteer
  );

router
  .route("/volunteers/city")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.cityVolunteer
  );

router
  .route("/eventlocation/volunteers/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    queryController.eventVolunteerLocation
  );

router
  .route("/events/volunteers")

  .get(queryController.eventVolunteer);

router
  .route("/user/mydonation")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    queryController.userMyDonation
  );

module.exports = router;
