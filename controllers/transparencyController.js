const Transparency = require("../models/transparencyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");

//@desc Create new transparency
//GET api/v1/transparency
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

exports.uploadTransparencyPhoto = upload.single("photo");

exports.resizeTransparencyPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `transparency-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)

    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/transparency/${req.file.filename}`);

  req.body.photo = `${req.protocol}://${req.get("host")}/img/transparency/${
    req.file.filename
  }`;

  next();
});

exports.createTransparency = catchAsync(async (req, res, next) => {
  newTransparency = await Transparency.create(req.body);
  res.status(201).json({ status: "success", data: newTransparency });
});

//@desc Get all transparency data
//GET api/v1/transparency
//Public
exports.getAllTransparency = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  const features = new APIServices(Transparency.find(), req.query)
    .filter({ name: regex })
    .sort()
    .limitFields()
    .paginate();

  const transparencies = await features.query.populate([
    {
      path: "event",
      select: "name type balance description status",
    },
    {
      path: "cause",
      select: "name status balance description",
    },
  ]);

  return res.status(200).json({
    status: "success",
    results: transparencies.length,
    data: { transparencies },
  });
});

//@desc Get single transparency
//GET api/v1/transparency
//Public
exports.getTransparency = catchAsync(async (req, res, next) => {
  const transparency = await Transparency.findById(req.params.id);

  if (!transparency) {
    return next(new AppError("No transparency found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { transparency } });
});

//@desc Update transparency
//GET api/v1/transparency
//Private
exports.updateTransparency = catchAsync(async (req, res, next) => {
  const transparency = await Transparency.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: false,
      new: true,
    }
  );

  if (!transparency) {
    return next(new AppError("No transparency found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { transparency } });
});

//@desc Delete transparency
//GET api/v1/transparency/::id
//Private
exports.deleteTransparency = factory.deleteOne(Transparency);
