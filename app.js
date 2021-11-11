const express = require("express");
const morgan = require("morgan");
const path = require("path");
const compression = require("compression");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: `Too many requests from this IP , please try again in an hour`,
});

app.use("/api", limiter);

app.use(cors());

const homeRouter = require("./routes/home.routes");
const eventRouter = require("./routes/event.routes");
const causeRouter = require("./routes/cause.routes");
const userRouter = require("./routes/user.routes");
const docsRouter = require("./routes/docs.routes");
const donationRouter = require("./routes/donation.routes");
const questionRouter = require("./routes/question.routes");
const contactRouter = require("./routes/contact.routes");
const transparencyRouter = require("./routes/transparency.routes");
const cause_typeRouter = require("./routes/cause_type.routes");
const volunteerRouter = require("./routes/volunteer.routes");
const ratingRouter = require("./routes/rating.routes");
const queryRouter = require("./routes/query.routes");
const ourWorkRouter = require("./routes/our_work.routes");
const our_work_topicRouter = require("./routes/our_work_topic.routes");
const homepageRouter = require("./routes/homepage.routes");
const AppError = require("./utils/appError");
const testimonyRouter = require("./routes/testimony.routes");
const emailVolunteer = require("./routes/emailVolunteer.routes");
const districtWiseOurwork = require("./routes/districtwisework.routes");
const ActOfKindness = require("./routes/act_of_kindness.routes");
const News = require("./routes/news.routes")

app.use("/", homeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/causes", causeRouter);
app.use("/api/v1/docs", docsRouter);
app.use("/api/v1/donations", donationRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/transparency", transparencyRouter);
app.use("/api/v1/cause_type", cause_typeRouter);
app.use("/api/v1/volunteers", volunteerRouter);
app.use("/api/v1/ratings", ratingRouter);
app.use("/api/v1/find", queryRouter);
app.use("/api/v1/ourworks", ourWorkRouter);
app.use("/api/v1/worktopics", our_work_topicRouter);
app.use("/api/v1/homepage", homepageRouter);
app.use("/api/v1/testimony", testimonyRouter);
app.use("/api/v1/emailvol", emailVolunteer);
app.use("/api/v1/districtworks", districtWiseOurwork);
app.use("/api/v1/kindness", ActOfKindness);
app.use("/api/v1/news", News);

app.all("*", (req, res, next) => {
  return next(new AppError(`Cant find ${req.originalUrl} on this server.`));
});

app.use(globalErrorHandler);

module.exports = app;
