const mongoose = require("mongoose");

const testimonySchema = new mongoose.Schema({
   content: {
    type: String,
    required: true,
  },

  volunteer: {
    type: mongoose.Schema.ObjectId,
    ref: "Volunteer",
    required: true,
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("Testimony", testimonySchema);
