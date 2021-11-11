const ActOfKindness = require("../models/kindnessModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");

//@desc Create new kindness
//POST api/v1/kindness
const multerStorage = multer.memoryStorage();

const multerFilter = (req, files, cb) => {
  if (files.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadKindnessPhoto = upload.array("photos", 10);

exports.resizeKindnessPhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.photos = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `kindness-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/kindness/${newFilename}`);

      req.body.photos.push(
        `${req.protocol}://${req.get("host")}/img/kindness/${newFilename}`
      );
    })
  );

  next();
});

exports.createKindness = catchAsync(async (req, res, next) => {
  newKindness = await ActOfKindness.create(req.body);
  res.status(201).json({ status: "success", data: newKindness });
});

//@desc Get all kindness
//GET api/v1/kindness
//Public

exports.getAllKindness= catchAsync(async (req, res, next) => {
    const kindness = await ActOfKindness.find().populate({
      path: "volunteer",
      select: "first_name last_name field_of_expertise",
    });
  
    return res.status(200).json({
      status: "success",
      results: kindness.length,
      data: { kindness },
    });
  });

//@desc Get single kindness
//GET api/v1/events/:id
//Private
exports.getKindness = catchAsync(async (req, res, next) => {
  const kindness = await ActOfKindness.findById(req.params.id);

  if (!kindness) {
    return next(new AppError("No act of kindness found with that id", 404));
  }
  res.status(200).json({ status: "success", data: kindness });
});

//@desc Update the kindess
//PATCH api/v1/events/:id
//Private
exports.updateKindness = factory.updateOne(ActOfKindness);

//@desc Update the event
//PATCH api/v1/events/:id
//Private
exports.deleteKindness = factory.deleteOne(ActOfKindness);
