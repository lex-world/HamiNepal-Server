const Event = require("../models/eventModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");

//@desc Create new event
//POST api/v1/events
//Private
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

exports.uploadEventPhoto = upload.array("photos", 10);

exports.resizeEventPhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.photos = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `event-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/events/${newFilename}`);

      req.body.photos.push(
        `${req.protocol}://${req.get("host")}/img/events/${newFilename}`
      );
    })
  );

  next();
});

exports.createEvent = catchAsync(async (req, res, next) => {
  newEvent = await Event.create(req.body);
  res.status(201).json({ status: "success", data: newEvent });
});

//@desc Get all events
//GET api/v1/events
//Public
exports.getAllEvents = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  const features = new APIServices(Event.find(), req.query)
    .filter({ name: regex })
    .sort()
    .limitFields()
    .paginate();
  const events = await features.query;

  return res.status(200).json({
    status: "success",
    results: events.length,
    data: events,
  });
});

//@desc Get single events
//GET api/v1/events/:id
//Private
exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError("No event found with that id", 404));
  }
  res.status(200).json({ status: "success", data: event });
});

//@desc Update the event
//PATCH api/v1/events/:id
//Private
exports.updateEvent = factory.updateOne(Event);

//@desc Update the event
//PATCH api/v1/events/:id
//Private
exports.deleteEvent = factory.deleteOne(Event);
