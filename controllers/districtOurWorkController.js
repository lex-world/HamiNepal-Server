const DistrictWiseOurWork = require("../models/ourwork_districtModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("../utils/apiServices");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");

//@desc Create new districtwiseourWork
//GET api/v1/districtworks
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

exports.uploadWorkImages = upload.array("photos", 10);


exports.resizeWorkImages = catchAsync(async (req, res, next) => {

  if (!req.files) return next();

  req.body.photos = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `Ourwork-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(640, 320)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/ourworks/${newFilename}`);

      req.body.photos.push(`${req.protocol}://${req.get("host")}/img/ourworks/${newFilename}`);
    })

  );

  next();
});

exports.createOurWork = catchAsync(async (req, res, next) => {
  newOurWork = await DistrictWiseOurWork.create(req.body);
  res.status(201).json({ status: "success", data: newOurWork });
});

//@desc Get all OurWork
//GET api/v1/districtworks
//Public
exports.getAllWork = catchAsync(async (req, res, next) => {
  const features = new APIServices(DistrictWiseOurWork.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const ourWork = await features.query;

  return res.status(200).json({
    status: "success",
    results: ourWork.length,
    data: { ourWork },
  });
});

//@desc Get single ourWork
//GET api/v1/districtworks/:id
//Public
exports.getSingleWork = factory.getOne(DistrictWiseOurWork);

//@desc Update single work
//GET api/v1/districtworks/:id
//Private
exports.updateSingleWork = factory.updateOne(DistrictWiseOurWork);

//@desc Delete single work
//GET api/v1/districtworks/:id
//Private
exports.deleteSingleWork = factory.deleteOne(DistrictWiseOurWork);
