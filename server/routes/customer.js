const express = require('express')
const Customer = require('../controllers/customer.js');

const validateToken = require('../utils').validateToken;

const customerRouter = express.Router();

customerRouter.route("/all").get(validateToken, Customer.all);
customerRouter.route("/getById").get(validateToken, Customer.getById);
customerRouter.route("/filter").get(validateToken, Customer.filter);
customerRouter.route("/add").post(validateToken, Customer.add);
customerRouter.route("/update").post(validateToken,Customer.update);

module.exports = customerRouter;