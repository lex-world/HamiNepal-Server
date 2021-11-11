const Donation = require("../models/donationModel");
const AppError = require("../utils/appError");
const APIServices = require("./../utils/apiServices");
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");

//@desc Get all donations
//GET api/v1/donations
//Public
exports.index = catchAsync(async (req, res, next) => {
  const features = new APIServices(Donation.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const donations = await features.query.populate([
    { path: "user", select: "firstname lastname" },
    {
      path: "event",
      select: "name type balance status",
    },
    {
      path: "cause",
      select: "name status balance",
    },
  ]);

  return res.status(200).json({
    status: "success",
    results: donations.length,
    data: [...donations],
  });
});

//@desc Create new donation
//POST api/v1/donations
//Public
exports.store = catchAsync(async (req, res, next) => {
  let isVerified = false;
  if (req.body.payment_type === "KHALTI") {
    isVerified = false;
    req.body.khaltiToken = req.body.KHALTI_TOKEN;

    let data = {
      token: req.body.KHALTI_TOKEN,
      amount: req.body.donation_amount * 100,
    };

    let config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_VERIFICATION_KEY}`,
      },
    };
    try {
      axios
        .post("https://khalti.com/api/v2/payment/verify/", data, config)
        .then(async (response) => {
          console.log("success", response.data);
          isVerified = true;
          const newDonation = await Donation.create({
            ...req.body,
            isVerified,
          });
          return res.status(201).json({ status: "success", data: newDonation });
        })
        .catch(async (error) => {
          console.log(error);
          isVerified = false;
          req.body.error = error.message;
          const newDonation = await Donation.create({
            ...req.body,
            isVerified,
          });
          return res
            .status(201)
            .json({ status: "error", data: { newDonation } });
        });
    } catch (err) {
      return res.json({ status: "error", error: err });
    }
  } else {
    const newDonation = await Donation.create({ ...req.body, isVerified });
    res.status(201).json({ status: "success", data: { newDonation } });
  }

  // const newDonation = await Donation.create(req.body);
  // res.status(201).json({ status: "success", data: newDonation });
});

//@desc Create new User donation
//POST api/v1/userdonations
//Private
exports.createDonation = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  let isVerified = false;
  if (req.body.payment_type === "KHALTI") {
    isVerified = false;
    req.body.khaltiToken = req.body.KHALTI_TOKEN;

    let data = {
      token: req.body.KHALTI_TOKEN,
      amount: req.body.donation_amount * 100,
    };

    let config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_VERIFICATION_KEY}`,
      },
    };
    try {
      axios
        .post("https://khalti.com/api/v2/payment/verify/", data, config)
        .then(async (response) => {
          console.log("success", response.data);
          isVerified = true;
          const newDonation = await Donation.create({
            ...req.body,
            isVerified,
          });
          return res.status(201).json({ status: "success", data: newDonation });
        })
        .catch(async (error) => {
          console.log(error);
          isVerified = false;
          req.body.error = error.message;
          const newDonation = await Donation.create({
            ...req.body,
            isVerified,
          });
          return res
            .status(201)
            .json({ status: "error", data: { newDonation } });
        });
    } catch (err) {
      return res.json({ status: "error", error: err });
    }
  } else {
    const newDonation = await Donation.create({ ...req.body, isVerified });
    res.status(201).json({ status: "success", data: { newDonation } });
  }

  // const newDonation = await Donation.create(req.body);
  // res.status(201).json({ status: "success", data: newDonation });
});

//@desc Get Single donation
//GET api/v1/donations/:id
//Public
exports.getDonation = catchAsync(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id).populate([
    { path: "user", select: "firstname lastname" },
    {
      path: "event",
      select: "name type balance status",
    },
    {
      path: "cause",
      select: "name status balance",
    },
  ]);

  if (!donation) {
    return next(new AppError("No donation found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { donation } });
});

//@desc Get Single donation
//GET api/v1/donations
//Public
exports.getMyDonation = catchAsync(async (req, res, next) => {
  const donation = await Donation.find({ user: req.user.id }).populate([
    { path: "user", select: "firstname lastname" },
    {
      path: "event",
      select: "name type balance status",
    },
    {
      path: "cause",
      select: "name status balance",
    },
  ]);

  if (!donation) {
    return next(new AppError("No donation found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { donation } });
});
