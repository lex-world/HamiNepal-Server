const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: [1, "Rating cannot be less than 1"],
    max: [5, "Rating cannot be less than 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  volunteer: {
    type: mongoose.Schema.ObjectId,
    ref: "Volunteer",
    required: true,
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
