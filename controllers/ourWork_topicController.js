const OurWorkTopic = require("../models/ourwork_topicModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createOurWork_topic = factory.createOne(OurWorkTopic);

exports.getAllOurWork_topic = catchAsync(async (req, res, next) => {
  const features = new APIServices(OurWorkTopic.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const ourWorktype = await features.query;

  return res.status(200).json({
    status: "success",
    results: ourWorktype.length,
    data: { ourWorktype },
  });
});

exports.getOurWork_topic = factory.getOne(OurWorkTopic);

exports.updateOurWork_topic = factory.updateOne(OurWorkTopic);

exports.deleteOurWork_topic = factory.deleteOne(OurWorkTopic);
