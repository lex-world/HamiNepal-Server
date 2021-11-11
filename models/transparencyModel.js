const mongoose = require("mongoose");
const slugify = require("slugify");

const transparencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A transparency must have a name"],
    },
    type: {
      type: String,
      enum: ["cause", "event"],
      required: [true, "A transparency must have a type"],
    },
    photo: {
      type: String,
      required: [true, "photo is required"],
    },
    amount: {
      type: Number,
      required: [true, "A transparency must have the amount spent"],
    },
    description: {
      type: String,
      required: [true, "A transparency must have a description"],
    },
    slug: { type: String },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    },
    cause: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cause",
      required: false,
    },
  },
  { timestamps: true }
);

transparencySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Transparency = mongoose.model("Transparency", transparencySchema);

module.exports = Transparency;
