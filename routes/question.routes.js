const express = require("express");
const questionController = require("../controllers/questionController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(questionController.getAllQuestions)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.createQuestion
  );

router
  .route("/:id")
  .get(questionController.getQuestion)
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.updateQuestion
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    questionController.deleteQuestion
  );

module.exports = router;
