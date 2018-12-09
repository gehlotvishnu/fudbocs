let mongoose = require('mongoose');
let validator = require('validator');

let customerSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  MiddleName: {
    type: String,
  },
  Mobile: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  AlternateNo: {
    type: String,
  },
  CityName: {
    type: String,
    required: true
  },
  Sex: {
    type: String,
    required: true
  },
  IdentityTypeId: {
    type: String
  },
  IdNumber: {
    type: String
  }
});

module.exports = mongoose.model('Customer', customerSchema)