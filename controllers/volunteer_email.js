const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Volunteer = require("../models/volunteerModel");
const sendEmail = require("../utils/email");

exports.emailVolunteer = catchAsync(async (req, res, next) => {
  let city = req.params.city;
  Volunteer.aggregate([
    {
      $lookup: {
        from: "events",
        localField: "city",
        foreignField: "city",
        as: "data",
      },
    },
    {
      $project: {
        data: {
          _id: 1,
          name: 1,
          city: 1,
          type: 1,
        },
        city: 1,
        email: 1,
        first_name: 1,
        last_name: 1,
      },
    },
    // {
    //   $match: {
    //     $expr: { $eq: ["$city", "$city"] },
    //   },
    // },
    // {
    //   $group: {
    //     _id: "$_id",
    //   },
    // },
    //   {
    //     $sort: {
    //       donation: -1,
    //     },
    //   },
  ]).exec((err, result) => {
    if (err) {
      return next(new AppError("Something Bad happened", 500));
    }
    let noNullData = [];

    result.forEach((element) => {
      if (
        element.data.length != 0 &&
        element.city == city &&
        element.data[0].type != "past"
      ) {
        noNullData.push(element);
      }
    });
    if (noNullData.length == 0) {
      res.send("This is a past event, No need to call the volunteers");
    } else {
      noNullData.forEach(async (person) => {
        const message = `Hello ${person.first_name} ${
          person.last_name
        },\n\nAn event titled ${person.data[0].name.toUpperCase()}  has been started at ${person.city.toUpperCase()}. We request you to be ready as a volunteer.\n\nHami Nepal Team\nKathmandu Nepal`;
        try {
          await sendEmail({
            email: person.email,
            subject: "Volunteers Call up",
            message,
          });

          // res
          //   .status(200)
          //   .send(
          //     "A verification email has been sent to " +
          //       person.email +
          //       ". It will be expired after one day. If you did not get verification Email click on resend token."
          //   );
        } catch (err) {
          res.status(500).send({
            msg: "Technical Issue! No email sent.",
            err,
          });
        }
      });
      const getName = (person) => {
        return [person.first_name];
      };
      res
        .status(200)
        .send("A call up  email has been sent to " + noNullData.map(getName));
    }
    // res.status(200).json({
    //   status: true,
    //   data: noNullData,
    // });
  });
});
