const mongoose = require("mongoose");
const slugify = require("slugify");

const causeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A cause must have a name"],
    },
    cause_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cause_type",
      required: [true, "A cause must have a type"],
    },
    photos: {
      type: [String],
    },
    summary: {
      type: String,
      required: [true, "A cause must have a summary"],
    },
    description: {
      type: String,
      required: [true, "A cause must have a description"],
    },
    challenges: {
      type: String,
      required: [true, "A cause must have challanges"],
    },
    difficulties: {
      type: String,
      required: [true, "A cause must have difficulties"],
    },
    status: {
      type: String,
      enum: ["normal", "important", "super"],
      default: "normal",
    },
    approval: {
      type: String,
      enum: ["Approved", "Unapproved"],
      default: "Unapproved",
      required: true,
    },
    balance: {
      type: Number,
      required: [true, "Please enter the balance"],
    },
    slug: { type: String },
  },

  { timestamps: true }
);

causeSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Cause = mongoose.model("Cause", causeSchema);

module.exports = Cause;
