const express = require('express')
const Invoice = require('../controllers/invoice.js');

const validateToken = require('../utils').validateToken;

const invoiceRouter = express.Router();

invoiceRouter.route("/generate").post(validateToken, Invoice.generate);
invoiceRouter.route("/getall").get(validateToken, Invoice.getall);
invoiceRouter.route("/getdetails").get(validateToken, Invoice.getIvoiceDetails);
invoiceRouter.route("/existmonth").get(validateToken, Invoice.invoiceExistformonth);

module.exports = invoiceRouter;


