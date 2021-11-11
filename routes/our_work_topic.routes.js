const express = require("express");

const ourWorkTopicController = require("./../controllers/ourWork_topicController");
const authController = require("./../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(ourWorkTopicController.getOurWork_topic)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    ourWorkTopicController.createOurWork_topic
  );

router
  .route("/:id")

  .put(
    authController.protect,
    authController.restrictTo("admin"),
    ourWorkTopicController.updateOurWork_topic
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    ourWorkTopicController.deleteOurWork_topic
  )

  .get(ourWorkTopicController.getOurWork_topic);

module.exports = router;
