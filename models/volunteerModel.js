const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "A volunteer must have a first name"],
    },
    last_name: {
      type: String,
      required: [true, "A volunteer must have a last name"],
    },
    phone: {
      type: Number,
      required: [true, "A volunteer must have a phone number"],
    },
    email: {
      type: String,
      required: [true, "A volunteer must have an email"],
    },
    age: {
      type: Number,
      // required: [true, "A volunteer must provide an age"],
    },
    bloodGroup: {
      type: String,
      enum: [
        "A +ve",
        "B +ve",
        "A -ve",
        "AB +ve",
        "AB -ve",
        "B -ve",
        "O +ve",
        "O -ve",
      ],
      // required: [true, "A volunteer must provide an age"],
    },
    field_of_expertise: {
      type: String,
      // required: [true, "A volunteer must have a field of expertise"],
    },
    bio: {
      type: String,
      required: [
        true,
        "A volunteer must have a bio or peoject involved description",
      ],
    },
    motivation: {
      type: String,
      required: [true, "A volunteer must have a motivation to join"],
    },
    country: {
      type: String,
      required: [true, "A volunteer must have a country"],
    },
    photo: {
      type: String,
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
    project_worked: {
      type: String
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
