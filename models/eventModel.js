const mongoose = require("mongoose");
const slugify = require("slugify");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An event must have a name"],
    },
    type: {
      type: String,
      enum: ["ongoing", "upcoming", "past"],
      default: "upcoming",
    },
    balance: {
      type: Number,
    },
    challenges: {
      type: String,
      required: [true, "An event must have challanges"],
    },
    difficulties: {
      type: String,
      required: [true, "An event must have difficulties"],
    },
    photos: {
      type: [String],
    },
    summary: {
      type: String,
      required: [true, "An event must have a summary"],
    },
    description: {
      type: String,
      required: [true, "An event must have a description"],
    },
    status: {
      type: String,
      enum: ["normal", "important", "super"],
      default: "normal",
    },
    country: {
      type: String,
      required: [true, "A volunteer must have a country"],
    },
    state: {
      type: String,
      required: [true, "A volunteer must have a state"],
      enum: [
        "Province 1",
        "Province 2",
        "Bagmati",
        "Gandaki",
        "Lumbini",
        "Karnali",
        "Sudurpashchim",
      ],
    },
    city: {
      type: String,
      required: [true, "A volunteer must have a city"],
    },
    street_address: {
      type: String,
      required: [true, "A volunteer must have a street address"],
    },

    slug: { type: String },
  },
  { timestamps: true }
);

eventSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
