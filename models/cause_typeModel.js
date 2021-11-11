const mongoose = require("mongoose");

const cause_typeSchema = new mongoose.Schema(
  {
    cause_type: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "A cause must have a type"],
    },
  },
  { timestamps: true }
);

const Cause_type = mongoose.model("Cause_type", cause_typeSchema);

module.exports = Cause_type;
