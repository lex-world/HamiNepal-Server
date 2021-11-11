const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const Token = require("../models/tokenModel.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email");

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id, user.role);

  // user.password = undefined;
  Token.create();
  res.status(statusCode).json({
    status: "success",
    token,
    // data: user,AS
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    // error occur
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
    // if email is exist into database i.e. email is associated with another user.
    else if (user) {
      return res.status(400).send({
        msg: "This email address is already associated with another account.",
      });
    }
    // if user is not exist into database then save the user into database for register account
    else {
      // password hashing for save into databse
      // req.body.password = Bcrypt.hashSync(req.body.password, 10);
      // create and save user
      user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
      });
      user.save(function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send({ msg: err.message });
        }

        // generate token and save
        var token = new Token({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        token.save(async function (err) {
          // var crypto = require("crypto");
          // var id = crypto.randomBytes(3).toString("hex");

          if (err) {
            return res.status(500).send({ msg: err.message, err });
          }

          const message = `Hello ${req.body.firstname} ${req.body.lastname},\n\nPlease verify your account by clicking the link: \nhttp://${req.headers.host}/api/v1/users/confirmation/${user.email}/${token.token}\n\nThank You for connecting with us !\n\nFrom\nHami Nepal Team`;
          try {
            await sendEmail({
              email: user.email,
              subject: "Account Verification Link",
              message,
            });

            res
              .status(200)
              .send(
                "A verification email has been sent to " +
                  user.email +
                  ". It will be expired after one day. If you did not get verification Email click on resend token."
              );
          } catch (err) {
            res.status(500).send({
              msg: "Technical Issue!, Please click on resend to verify your Email.",
              err,
            });
          }

          // Send email (use credintials of SendGrid)
          // var transporter = nodemailer.createTransport({
          //   host: process.env.SMTP_HOST,
          //   port: process.env.SMTP_PORT,
          //   auth: {
          //     user: process.env.SENDGRID_USERNAME,
          //     pass: process.env.SENDGRID_PASSWORD,
          //   },
          // });
          // var mailOptions = {
          //   from: "no-reply@example.com",
          //   to: user.email,
          //   subject: "Account Verification Link",
          //   text:
          //     "Hello " +
          //     req.body.name +
          //     ",\n\n" +
          //     "Please verify your account by clicking the link: \nhttp://" +
          //     req.headers.host +
          //     "/confirmation/" +
          //     user.email +
          //     "/" +
          //     token.token +
          //     "\n\nThank You!\n",
          // };
          // await transporter.sendEMail(mailOptions, function (err) {
          //   if (err) {
          // return res.status(500).send({
          //   msg: "Technical Issue!, Please click on resend to verify your Email.",
          //   err,
          // });
          //   }
          // return res
          //   .status(200)
          //   .send(
          //     "A verification email has been sent to " +
          //       user.email +
          //       ". It will be expired after one day. If you did not get verification Email click on resend token."
          //   );
          // });
        });
      });
    }
  });
});

// exports.signup = catchAsync(async (req, res, next) => {
//   const { email } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     return res.status(409).json({
//       status: "fail",
//       message: "This email address is already associated with another account.",
//     });
//   }

//   const user = new User({
//     firstname: req.body.firstname,
//     lastname:req.body.lastname,
//     email: req.body.email,
//     password: req.body.password,
//   });

//   await user.save();
//   createSendToken(user, 200, req, res);
// });
// It is GET method, you have to write like that
//    app.get('/confirmation/:email/:token',confirmEmail)

exports.confirmEmail = function (req, res, next) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    // token is not found into database i.e. token may have expired
    if (!token) {
      return res.status(400).send({
        msg: "Your verification link may have expired. Please click on resend for verify your Email.",
      });
    }
    // if token is found then check valid user
    else {
      User.findOne(
        { _id: token._userId, email: req.params.email },
        function (err, user) {
          // not valid user
          if (!user) {
            return res.status(401).send({
              msg: "We were unable to find a user for this verification. Please SignUp!",
            });
          }
          // user is already verified
          else if (user.isVerified) {
            return res
              .status(200)
              .send("User has been already verified. Please Login");
          }
          // verify user
          else {
            // change isVerified to true
            user.isVerified = true;
            user.save(function (err) {
              // error occur
              if (err) {
                return res.status(500).send({ msg: err.message });
              }
              // account successfully verified
              else {
                return res
                  .status(200)
                  .send("Your account has been successfully verified");
              }
            });
          }
        }
      );
    }
  });
};

exports.resendLink = function (req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
    // user is not found into database
    if (!user) {
      return res.status(400).send({
        msg: "We were unable to find a user with that email. Make sure your Email is correct!",
      });
    }
    // user has been already verified
    else if (user.isVerified) {
      return res
        .status(200)
        .send("This account has been already verified. Please log in.");
    }
    // send verification link
    else {
      // generate token and save
      var token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      token.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }

        // Send email (use credintials of SendGrid)
        var transporter = nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD,
          },
        });
        var mailOptions = {
          from: "no-reply@example.com",
          to: user.email,
          subject: "Account Verification Link",
          text:
            "Hello " +
            user.name +
            ",\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/confirmation/" +
            user.email +
            "/" +
            token.token +
            "\n\nThank You!\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).send({
              msg: "Technical Issue!, Please click on resend for verify your Email.",
            });
          }
          return res
            .status(200)
            .send(
              "A verification email has been sent to " +
                user.email +
                ". It will be expire after one day. If you not get verification Email click on resend token."
            );
        });
      });
    }
  });
};

// exports.login = catchAsync(async (req, res, next) => {
//   User.findOne({ email: req.body.email }, async (err, user) => {
//     // error occur
//     if (err) {
//       return res.status(500).send({ message: err.message });
//     }
//     // user is not found in database i.e. user is not registered yet.
//     else if (!user) {
//       return res.status(401).send({
//         message:
//           'The email address ' +
//           req.body.email +
//           ' is not associated with any account. please check and try again!',
//       });
//     }
//     // comapre user's password if user is find in above step
//     else if (
//       !user ||
//       !(await User.correctPassword(req.body.password, user.password))
//     ) {
//       return res.status(401).send({ message: 'Invalid email or Password!' });
//     }
//     // check user is verified or not
//     else if (!user.isVerified) {
//       return res.status(401).send({
//         message: 'Your Email has not been verified. Please click on resend',
//       });
//     }
//     // user successfully logged in
//     else {
//       createSendToken(user, 200, req, res);
//     }
//   });
// });

exports.login = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });

  const { error } = schema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) {
    return next(new AppError(`${error.details[0].message}`, 403));
  }

  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (user.role === "admin") {
    return next(new AppError("Not for admin login", 401));
  }
  // if (!user.isVerified) {
  //   return res.status(401).send({
  //     status: 'fail',
  //     message: 'Your Email has not been verified. Please click on resend',
  //   });
  // }

  // 3) If everything ok, send token to client
  if (user.isVerified === false) {
    return next(new AppError("Account not verified", 403));
  }
  createSendToken(user, 200, req, res);
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });

  const { error } = schema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) {
    return next(new AppError(`${error.details[0].message}`, 403));
  }

  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (user.role === "user") {
    return next(new AppError("Not for user login", 401));
  }
  // if (!user.isVerified) {
  //   return res.status(401).send({
  //     status: 'fail',
  //     message: 'Your Email has not been verified. Please click on resend',
  //   });
  // }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE

  req.user = currentUser;

  // res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3) Check if user changed password after the token was issued
//       if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next();
//       }

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };

//Route protection  to only admin
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action.`, 403)
      );
    }
    next();
  };
};

// Node js express  authentication and authorization middleware

//Route protection to both admin and user
exports.restrictToBoth = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action.`, 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot Your Password? Submit a Patch Request with your new password and PasswordConfirm to : ${resetURL} \n If you did not forget your password , please ignore this message.`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token valid for 10 minutes.",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// It is GET method, you have to write like that
//    app.get('/confirmation/:email/:token',confirmEmail)

exports.verifyNumber = function (req, res, next) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    // token is not found into database i.e. token may have expired
    if (!token) {
      return res.status(400).send({
        msg: "Your verification code may have expired. Please click on resend for verify your number.",
      });
    }
    // if token is found then check valid user
    else {
      User.findOne(
        { _id: token._userId, phone: req.params.phone },
        function (err, user) {
          // not valid user
          if (!user) {
            return res.status(401).send({
              msg: "We were unable to find a user for this verification. Please SignUp!",
            });
          }
          // user is already verified
          else if (user.isVerified) {
            return res
              .status(200)
              .send("User has been already verified. Please Login");
          }
          // verify user
          else {
            // change isVerified to true
            user.isVerified = true;
            user.save(function (err) {
              // error occur
              if (err) {
                return res.status(500).send({ msg: err.message });
              }
              // account successfully verified
              else {
                return res
                  .status(200)
                  .send("Your account has been successfully verified");
              }
            });
          }
        }
      );
    }
  });
};

exports.resendCode = function (req, res, next) {
  User.findOne({ phone: req.body.phone }, function (err, user) {
    // user is not found into database
    if (!user) {
      return res.status(400).send({
        msg: "We were unable to find a user with that phone. Make sure your Phone number is correct!",
      });
    }
    // user has been already verified
    else if (user.isVerified) {
      return res
        .status(200)
        .send("This number has been already verified. Please log in.");
    }
    // send verification link
    else {
      const otpCode = parseInt(Math.random() * 1000000);
      // generate token and save
      let token = new Token({ _userId: user._id, token: otpCode });
      token.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        sendSMS(
          `Your verification code :${token.token}`,
          `+977${req.body.phone}`
        )
          .then(() => {
            return res
              .status(200)
              .send(
                "A verification code has been sent to " +
                  user.phone +
                  ". It will be expire after 10 mins. If you did not get verification code click on resend token."
              );
          })
          .catch((err) => {
            return res.status(500).send(err.message);
          });
      });
    }
  });
};
