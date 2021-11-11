const Testimony = require("../models/testimonyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory= require("./handlerFactory");

exports.createTestimony = catchAsync(async (req, res, next) => {
  newTestimony = await Testimony.create(req.body);
  res.status(201).json({ status: "success", data: newTestimony });
});

exports.getAllTestimony= catchAsync(async (req, res, next) => {
  const testimony = await Testimony.find().populate({
    path: "volunteer",
    select: "first_name last_name field_of_expertise",
  });

  return res.status(200).json({
    status: "success",
    results: testimony.length,
    data: { testimony },
  });
});

exports.getTestimony = factory.getOne(Testimony);

exports.updateTestimony = factory.updateOne(Testimony);

exports.deleteTestimony = factory.deleteOne(Testimony);
