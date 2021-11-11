const mongoose = require("mongoose");

const ourWorkSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OurWorkTopic",
      required: [true, "Images must have a topic"],
    },
    summary: {
      type: String,
      required: [true, "An image must have a summary"],
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
      required: [true, "An Image must have a description"],
    },
  },
  { timestamps: true }
);

const OurWork = mongoose.model("OurWork", ourWorkSchema);

module.exports = OurWork;
