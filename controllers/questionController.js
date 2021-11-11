const Question = require("../models/questionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const factory = require("./handlerFactory");

exports.createQuestion = catchAsync(async (req, res, next) => {
  // req.body.userId = req.user._id;
  const newQuestion = await Question.create(req.body);
  return res.status(201).json({ status: "success", data: newQuestion });
});

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const features = new APIServices(Question.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const questions = await features.query;

  return res.status(200).json({
    status: "success",
    results: questions.length,
    data: { questions },
  });
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError("No question found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { question } });
});

exports.updateQuestion = factory.updateOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);
