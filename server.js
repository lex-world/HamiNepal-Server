const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION ! Shutting Down....");
  console.log(err);
  process.exit(1);
});

const DB =
  process.env.NODE_ENV === "development"
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE;

mongoose
  .connect(DB, {
    keepAlive: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connected...`);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running at PORT : ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION ! Shutting Down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

if (process.env.NODE_ENV === "production") {
  setInterval(() => axios.get("https://haminepal.herokuapp.com/"), 1740000);
}
