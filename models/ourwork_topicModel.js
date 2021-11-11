const mongoose = require("mongoose");

const ourwork_topicSchema = new mongoose.Schema(
  {
    work_topic: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "A work must have a topic"],
    },
  },
  { timestamps: true }
);

const OurWork_Topic = mongoose.model("OurWorkTopic", ourwork_topicSchema);

module.exports = OurWork_Topic;
