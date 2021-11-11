const OurWork = require("../models/ourWorkModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");

//@desc Create new ourWork
//GET api/v1/ourworks
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

exports.uploadWorkImages = upload.array("photo", 10);
//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_UNEXPECTED_FILE") {
//       return res.send("Too many files to upload.");
//     }
//   } else if (err) {
//     return res.send(err);
//   }

//   next();
// });

exports.resizeWorkImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `Ourwork-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(640, 320)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`upload/${newFilename}`);

      req.body.images.push(newFilename);
    })
  );

  next();
});

exports.createOurWork = catchAsync(async (req, res, next) => {
  newOurWork = await OurWork.create(req.body);
  res.status(201).json({ status: "success", data: newOurWork });
});

//@desc Get all OurWork
//GET api/v1/ourworks
//Public
exports.getAllWork = catchAsync(async (req, res, next) => {
  const features = new APIServices(OurWork.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const ourWork = await features.query.populate({
    path: "topic",
    select: "work_topic",
  });

  return res.status(200).json({
    status: "success",
    results: ourWork.length,
    data: { ourWork },
  });
});

//@desc Get single ourWork
//GET api/v1/ourworks/:id
//Public
exports.getSingleWork = factory.getOne(OurWork);

//@desc Update single work
//GET api/v1/ourworks/:id
//Private
exports.updateSingleWork = factory.updateOne(OurWork);

//@desc Delete single work
//GET api/v1/ourworks/:id
//Private
exports.deleteSingleWork = factory.deleteOne(OurWork);
