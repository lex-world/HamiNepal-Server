const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
    },
    phone: {
      type: String,
    },
    subject: {
      type: String,
      required: [true, "Please enter a subject"],
    },
    message: {
      type: String,
      required: [true, "Please enter a message to submit"],
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
