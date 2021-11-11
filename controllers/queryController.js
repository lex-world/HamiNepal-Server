const Donation = require("../models/donationModel");
const Volunteer = require("../models/volunteerModel");
const Event = require("../models/eventModel");
const Rating = require("../models/ratingModel");
// const User = require("../models/userModel");
const AppError = require("../utils/appError");
const APIServices = require("../utils/apiServices");
const catchAsync = require("../utils/catchAsync");

//@desc Get total donation for cause
//GET api/v1/find/causes/totalDonations
//Public
exports.causeDonationAmount = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $project: {
        _id: 1,
        cause: 1,
        donation_amount: 1,
        category: 1,
        data: 1,
      },
    },
    {
      $match: {
        $expr: { $eq: ["$category", "cause"] },
      },
    },

    {
      $group: {
        _id: "$cause",
        donation: { $sum: "$donation_amount" },
      },
    },
  ]).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get total donation for event
//GET api/v1/find/events/totalDonations
//Public
exports.eventDonationAmount = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $project: {
        _id: 1,
        event: 1,
        donation_amount: 1,
        category: 1,
      },
    },
    {
      $match: {
        $expr: { $eq: ["$category", "event"] },
      },
    },

    {
      $group: {
        _id: "$event",
        donation: { $sum: "$donation_amount" },
      },
    },
  ]).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get total donation for each event
//GET api/v1/find/allevents/totaldonation
//Public
exports.allEventDonationAmount = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $project: {
        event: 1,
        donation_amount: 1,
        category: 1,
      },
    },

    {
      $match: {
        $expr: { $eq: ["$category", "event"] },
      },
    },

    {
      $group: {
        _id: null,
        donation: { $sum: "$donation_amount" },
      },
    },
  ]).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get total donation for each event
//GET api/v1/find/allevents/totaldonation
//Public
exports.allEventDonationAmount = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $project: {
        event: 1,
        donation_amount: 1,
        category: 1,
      },
    },

    {
      $match: {
        $expr: { $eq: ["$category", "event"] },
      },
    },

    {
      $group: {
        _id: null,
        donation: { $sum: "$donation_amount" },
      },
    },
  ]).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get total donations for all
//GET api/v1/find/totaldonation
//Public
exports.totalDonation = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $project: {
        donation_amount: 1,
      },
    },

    {
      $group: {
        _id: null,
        donation: { $sum: "$donation_amount" },
      },
    },
  ]).exec((err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get top donar for the event
//GET api/v1/find/events/topdonar
//Private
exports.topEventDonar = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "data",
      },
    },
    {
      $project: {
        data: {
          _id: 1,
        },
        donation_amount: 1,
        category: 1,
      },
    },
    {
      $match: {
        $expr: { $eq: ["$category", "event"] },
      },
    },
    {
      $group: {
        _id: "$data._id",
        donation: { $sum: "$donation_amount" },
      },
    },
    {
      $sort: {
        donation: -1,
      },
    },
  ]).exec((err, result) => {
    if (err) {
      return next(new ErrorResponse("Something Bad happened", 500));
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get top donar for the cause
//GET api/v1/find/causes/topdonar
//Private
exports.topCauseDonar = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "data",
      },
    },
    {
      $project: {
        data: {
          _id: 1,
        },
        donation_amount: 1,
        category: 1,
      },
    },
    {
      $match: {
        $expr: { $eq: ["$category", "cause"] },
      },
    },
    {
      $group: {
        _id: "$data._id",
        donation: { $sum: "$donation_amount" },
      },
    },
    {
      $sort: {
        donation: -1,
      },
    },
  ]).exec((err, result) => {
    if (err) {
      return next(new ErrorResponse("Something Bad happened", 500));
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get average rating for the volunteer
//GET api/v1/find/average/rating
//Private
exports.getAverageRating = catchAsync(async (req, res, next) => {
  Rating.aggregate([
    {
      $project: {
        rating: 1,
        volunteer: 1,
      },
    },
    {
      $group: {
        _id: "$volunteer",
        rating: { $sum: "$rating" },
        count: { $sum: 1 },
      },
    },
    {
      $addFields: {
        AverageRating: { $divide: ["$rating", "$count"] },
      },
    },
    {
      $sort: {
        AverageRating: -1,
      },
    },
    {
      $limit: 5,
    },
  ]).exec((err, result) => {
    if (err) {
      return next(new AppError("Something Bad happened", 500));
    }

    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get volunteer according to states
//GET api/v1/find/volunteers/states
//Private
exports.stateVolunteer = catchAsync(async (req, res, next) => {
  Volunteer.aggregate([
    {
      $project: {
        _id: 1,
        state: 1,
      },
    },
    {
      $group: {
        _id: "$state",
        volunteers: { $sum: 1 },
      },
    },
    {
      $sort: {
        volunteers: -1,
      },
    },
  ]).exec((err, result) => {
    if (err) {
      return next(new AppError("Something Bad happened", 500));
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get volunteer according to cities
//GET api/v1/find/volunteers/city
//Private
exports.cityVolunteer = catchAsync(async (req, res, next) => {
  Volunteer.aggregate([
    {
      $project: {
        _id: 1,
        state: 1,
        city: 1,
        field_of_expertise: 1,
        first_name: 1,
        last_name: 1,
        phone: 1,
        age: 1,
        email: 1,
      },
    },

    {
      $group: {
        _id: "$city",
        volunteers: { $sum: 1 },
        data: {
          $push: {
            Name: { $concat: ["$first_name", " ", "$last_name"] },
            field_of_expertise: "$field_of_expertise",
            phone: "$phone",
            email: "$email",
            age: "$age",
          },
        },
      },
    },

    {
      $sort: {
        volunteers: -1,
      },
    },
  ]).exec((err, result) => {
    if (err) {
      return next(new AppError("Something Bad Happened", 500));
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});

//@desc Get volunteer according to location of the event
//GET api/v1/find/eventlocation/volunteers/:eventId
//Private
exports.eventVolunteerLocation = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new AppError("No event found with that id", 404));
  }
  const volunteer = await Volunteer.find({ city: event.city });
  if (volunteer.length == 0) {
    return next(
      new AppError("No volunteers currently volunteering for this event", 404)
    );
  }
  res.status(200).json({
    status: true,
    events: { event },
    volunteers: { volunteer },
  });
});

//@desc Get volunteer according to events
//GET api/v1/find/events/volunteers
//Private
exports.eventVolunteer = catchAsync(async (req, res, next) => {
  Volunteer.aggregate([
    {
      $lookup: {
        from: "events",
        localField: "event",
        foreignField: "_id",
        as: "data",
      },
    },
    {
      $project: {
        _id: 1,
        state: 1,
        city: 1,
        field_of_expertise: 1,
        first_name: 1,
        last_name: 1,
        phone: 1,
        age: 1,
        email: 1,
        event: 1,
        data: {
          _id: 1,
          name: 1,
        },
      },
    },
    {
      $group: {
        _id: "$event",
        data: {
          $push: {
            Event: "$data.name",
            Name: { $concat: ["$first_name", " ", "$last_name"] },
            field_of_expertise: "$field_of_expertise",
            phone: "$phone",
            email: "$email",
            age: "$age",
          },
        },
      },
    },
  ]).exec((err, result) => {
    if (err) {
      return next(new AppError(err, 500));
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
  //   const event = await Event.findById(req.params.id);
  //   if (!event) {
  //     return next(new AppError("No event found with that id", 404));
  //   }
  //   const volunteer = await Volunteer.find({ event: req.params.id });
  //   if (volunteer.length == 0) {
  //     return next(
  //       new AppError("No volunteers currently volunteering for this event", 404)
  //     );
  //   }
  //   res.status(200).json({
  //     status: true,
  //     events: { event },
  //     volunteers: { volunteer },
  //   });
});

//@desc Get all the donations done by the user
//GET api/v1/find/user/mydonation
//Private
exports.userMyDonation = catchAsync(async (req, res, next) => {
  Donation.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "data",
      },
    },
    // {
    //   $project: {
    //     _id: 1,
    //   },
    // },
    // {
    //   $group: {
    //     _id: "$state",
    //     volunteers: { $sum: 1 },
    //   },
    // },
    // {
    //   $sort: {
    //     volunteers: -1,
    //   },
    // },
  ]).exec((err, result) => {
    if (err) {
      return next(new AppError("Something Bad happened", 500));
    }
    res.status(200).json({
      status: true,
      data: result,
    });
  });
});
