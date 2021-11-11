const express = require("express");

const cause_typeController = require("./../controllers/cause_typeController");
const authController = require("./../controllers/authController");
const allqueryresults = require("../middleware/allqueryresults");
const cause_type = require("../models/cause_typeModel");
const router = express.Router();

router
  .route("/")
  .get(allqueryresults(cause_type), cause_typeController.getAllCause_type)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    cause_typeController.createCause_type
  );

router
  .route("/:id")

  .put(
    authController.protect,
    authController.restrictTo("admin"),
    cause_typeController.updateCause_type
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    cause_typeController.deleteCause_type
  )

  .get(cause_typeController.getCause_type);

module.exports = router;
