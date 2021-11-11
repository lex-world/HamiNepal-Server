const mongoose = require("mongoose");

const homepageSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const HomePage = mongoose.model("Homepage", homepageSchema);

module.exports = HomePage;
