const Contact = require("../models/contactModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIServices = require("./../utils/apiServices");
const factory = require("./handlerFactory");

//@desc Create new contact
//POST api/v1/contacts
//Public
exports.createContact = catchAsync(async (req, res, next) => {
  newContact = await Contact.create(req.body);
  res.status(201).json({ status: "success", data: { newContact } });
});

//@desc Get all contacts
//GET api/v1/contacts
//Private
exports.getAllContacts = catchAsync(async (req, res, next) => {
  const features = new APIServices(Contact.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const contacts = await features.query;

  return res.status(200).json({
    status: "success",
    results: contacts.length,
    data: { contacts },
  });
});

//@desc Get single contact
//GET api/v1/contacts/:id
//Private
exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new AppError("No contact found with that id", 404));
  }
  res.status(200).json({ status: "success", data: { contact } });
});

//@desc Update Contact
//PATCH api/v1/contacts/:id
//Private
exports.updateContact = factory.updateOne(Contact);

//@desc Update Contact
//PATCH api/v1/contacts/:id
//Private
exports.deleteContact = factory.deleteOne(Contact);
