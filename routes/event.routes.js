const express = require("express");
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    eventController.uploadEventPhoto,
    eventController.resizeEventPhoto,
    eventController.createEvent
  );

router
  .route("/:id")
  .get(eventController.getEvent)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    eventController.uploadEventPhoto,
    eventController.resizeEventPhoto,
    eventController.updateEvent
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    eventController.deleteEvent
  );

module.exports = router;
