const Rating = require("../models/ratingModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createRating = catchAsync(async (req, res, next) => {
  newRating = await Rating.create(req.body);
  res.status(201).json({ status: "success", data: newRating });
});

exports.getAllRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.find().populate({
    path: "volunteer",
    select: "first_name last_name field_of_expertise",
  });

  return res.status(200).json({
    status: "success",
    results: rating.length,
    data: { rating },
  });
});

exports.getRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    return next(new AppError("No rating found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { rating } });
});

exports.updateRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: false,
    new: true,
  });

  if (!rating) {
    return next(new AppError("No rating found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { rating } });
});

exports.deleteRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.findByIdAndDelete(req.params.id);

  if (!rating) {
    return next(new AppError("No token found with that id", 404));
  }
  res.status(204).json({ status: "success", data: {} });
});
