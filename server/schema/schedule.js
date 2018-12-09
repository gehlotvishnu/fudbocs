let mongoose = require('mongoose');
let validator = require('validator');

let schedulerSchema = new mongoose.Schema({
  CustomerId: { type: mongoose.Schema.ObjectId, ref: 'Customer', required: true },
//   TiffinType: { type: Number, required: true},
  Date: [{ type: Object }]
})

module.exports = mongoose.model('Scheduler', schedulerSchema)