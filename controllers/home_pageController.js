const HomePage = require("../models/home_pageModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");
const path = require("path");

//@desc Create new ourWork
//POST api/v1/homepage
//Private
const videoStorage = multer.diskStorage({
  destination: "public/videos", // Destination to store video
  filename: (req, file, cb) => {
    cb(
      null,

      file.fieldname + path.extname(file.originalname)
    );
  },
});

const VideoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {
      // upload only mp4 and mkv format
      return cb(new Error("Please upload a Video"));
    }
    cb(undefined, true);
  },
});
exports.uploadHomeVideo = VideoUpload.single("video");

exports.locateVideo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.videoUrl = `${req.protocol}://${req.get("host")}/videos/${
    req.file.filename
  }`;

  next();
});

exports.createHomepage = catchAsync(async (req, res, next) => {
  newContent = await HomePage.create(req.body);
  res.status(201).json({ status: "success", data: newContent });
});

//@desc Get all OurWork
//GET api/v1/ourworks
//Public
exports.getContent = factory.getAll(HomePage);

//@desc Update single work
//UPDATE api/v1/homepage/:id
//Private
exports.updateSingleContent = factory.updateOne(HomePage);

//@desc Delete single work
//DELETE api/v1/homepage/:id
//Private
exports.deleteSingleContent = factory.deleteOne(HomePage);
