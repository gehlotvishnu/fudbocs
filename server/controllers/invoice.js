<<<<<<< HEAD
const Invoice = require("../models/invoice.js");

const generate = function (req, res, next) {

  var nextmonth = `${req.body.month + 1}`.replace(/^(\d)$/, '0$1');
  try {
    let params = {
      year: req.body.year,
      month: req.body.month,
      role: req.body.role
    };
    const newinvoice = new Invoice(params);
    newinvoice.generate().then(function (status) {
      res.send(status)
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

const getall = function (req, res, next) {
  try {
    new Invoice({}).getall(req.query.month, req.query.year).then(function (invoices) {
      res.send(invoices);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

const getIvoiceDetails = function (req, res, next) {
  try {
    new Invoice({}).getInvoiceDetails(req.query.invoiceNo).then(function (invoice_details) {
      res.send(invoice_details);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

const invoiceExistformonth = function (req, res, next) {
  try {
    new Invoice({}).invoiceExistformonth(req.query.month, req.query.year).then(function (status) {
      res.send(status);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { generate, getall, getIvoiceDetails, invoiceExistformonth };
=======
const Invoice = require("../models/invoice.js");

const generate = function (req, res, next) {

  var nextmonth = `${req.body.month + 1}`.replace(/^(\d)$/, '0$1');
  try {
    let params = {
      year: req.body.year,
      month: req.body.month,
      role: req.body.role
    };
    const newinvoice = new Invoice(params);
    newinvoice.generate().then(function (status) {
      res.send(status)
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

const getall = function (req, res, next) {
  try {
    new Invoice({}).getall(req.query.month, req.query.year).then(function (invoices) {
      res.send(invoices);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

const getIvoiceDetails = function (req, res, next) {
  try {
    new Invoice({}).getInvoiceDetails(req.query.invoiceNo).then(function (invoice_details) {
      res.send(invoice_details);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

const invoiceExistformonth = function (req, res, next) {
  try {
    new Invoice({}).invoiceExistformonth(req.query.month, req.query.year).then(function (status) {
      res.send(status);
    });
  } catch (err) {
    console.log("Error: ", err);
  }
}

module.exports = { generate, getall, getIvoiceDetails,invoiceExistformonth };
>>>>>>> c3d5ca07472139f5b6393ba179c46cfbe15b9c47
