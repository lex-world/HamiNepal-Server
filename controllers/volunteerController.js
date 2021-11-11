const Volunteer = require("../models/volunteerModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");

//@desc Create new Volunteer
//GET api/v1/volunteer
//Public
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadVolunteerPhoto = upload.single("photo");

exports.resizeVolunteerPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `volunteer-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/volunteer/${req.file.filename}`);

  req.body.photo = `${req.protocol}://${req.get("host")}/img/volunteer/${
    req.file.filename
  }`;

  next();
});

//@desc Create new Volunteer
//POST api/v1/volunteer
//Public
exports.createVolunteer = catchAsync(async (req, res, next) => {
  volunteer = await Volunteer.create(req.body);
  res.status(201).json({ status: "success", data: volunteer });
});

//@desc Create new Volunteer
//GET api/v1/volunteer
//Public
exports.getAllVolunteers = catchAsync(async (req, res, next) => {
  const features = new APIServices(Volunteer.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const volunteers = await features.query;

  return res.status(200).json({
    status: "success",
    results: volunteers.length,
    data: { volunteers },
  });
});

//@desc Create new Volunteer
//GET api/v1/volunteer/:id
//Public
exports.getVolunteer = catchAsync(async (req, res, next) => {
  const volunteer = await Volunteer.findById(req.params.id);

  if (!volunteer) {
    return next(new AppError("No volunteer found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { volunteer } });
});

//@desc delete new Volunteer
//DELETE api/v1/volunteer/:id
//Private
exports.deleteVolunteer = factory.deleteOne(Volunteer);

//@desc Create new Volunteer
//PATCH api/v1/volunteer/:id
//Private
exports.updateVolunteer = factory.updateOne(Volunteer);
