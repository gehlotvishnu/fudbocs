const Customer = require("../models/customer.js")

const add = function (req, res, next) {
  let params = {
    name: req.body.name,
    gender: req.body.gender,
    HouseNo: req.body.HouseNo,
    GaliSector: req.body.GaliSector,
    Area: req.body.Area,
    City: req.body.City,
    Landmark: req.body.Landmark,
    mobile: req.body.mobile,
    email: req.body.email,
    remark: req.body.remark,
    isActive: req.body.isActive,
    createdBy: 'Admin',
    breakfast: req.body.breakfast,
    breakfast_qty: req.body.breakfast,
    breakfast_amount: req.body.breakfast_amount,
    lunch: req.body.lunch,
    lunch_qty: req.body.lunch_qty,
    lunch_amount: req.body.lunch_amount,
    dinner: req.body.dinner,
    dinner_qty: req.body.dinner_qty,
    dinner_amount: req.body.dinner_amount,
    exclude_MON: req.body.exclude_MON,
    exclude_TUE: req.body.exclude_TUE,
    exclude_WED: req.body.exclude_WED,
    exclude_THU: req.body.exclude_THU,
    exclude_FRI: req.body.exclude_FRI,
    exclude_SAT: req.body.exclude_SAT,
    exclude_SUN: req.body.exclude_SUN,
  };
  const newCustomer = new Customer(params);

  try {
    newCustomer.add().then(function () {
      // if(req.decoded.role === 'admin') {
      new Customer({}).all().then(function (customerList) {
        res.send(customerList);
      });
      // } else {
      // 	new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
      // 		res.send(customerList);
      // 	});
      // }
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const all = function (req, res, next) {
  try {
    // if(req.decoded.role === 'admin') {
    new Customer({}).all().then(function (customerList) {
      res.send(customerList);
    });
    // } else {
    // new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
    // 	res.send(customerList);
    // });
    // }
  } catch (err) {
    console.log("Error: ", err);
  }
}

const getById = function (req, res, next) {
  try {
    // if(req.decoded.role === 'admin') {
    new Customer({}).getById(req.query.customerId).then(function (customer) {
      res.send(customer);
    });
    // } else {
    // new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
    // 	res.send(customerList);
    // });
    // }
  } catch (err) {
    console.log("Error: ", err);
  }
}



const filter = function (req, res, next) {
  try {
    params = {
      date: req.query.date ? new Date(req.query.date) : new Date(),
      tiffinType: req.query.tiffinType ? req.query.tiffinType.split(',') : [1, 2, 3, 4]
    }
    // if(req.decoded.role === 'admin') {
    new Customer({}).filter(params).then(function (customerList) {
      res.send(customerList);
    });
    // } else {
    // new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
    // 	res.send(customerList);
    // });
    // }
  } catch (err) {
    console.log("Error: ", err);
  }
}

const update = function (req, res, next) {
  let params = {
    id: req.body.id,
    name: req.body.name,
    gender: req.body.gender,
    HouseNo: req.body.HouseNo,
    GaliSector: req.body.GaliSector,
    Area: req.body.Area,
    City: req.body.City,
    Landmark: req.body.Landmark,
    mobile: req.body.mobile,
    email: req.body.email,
    remark: req.body.remark,
    isActive: req.body.isActive,
    breakfast: req.body.breakfast,
    breakfast_qty: req.body.breakfast,
    breakfast_amount: req.body.breakfast_amount,
    lunch: req.body.lunch,
    lunch_qty: req.body.lunch_qty,
    lunch_amount: req.body.lunch_amount,
    dinner: req.body.dinner,
    dinner_qty: req.body.dinner_qty,
    dinner_amount: req.body.dinner_amount,
    exclude_MON: req.body.exclude_MON,
    exclude_TUE: req.body.exclude_TUE,
    exclude_WED: req.body.exclude_WED,
    exclude_THU: req.body.exclude_THU,
    exclude_FRI: req.body.exclude_FRI,
    exclude_SAT: req.body.exclude_SAT,
    exclude_SUN: req.body.exclude_SUN,
  };
  const newCustomer = new Customer(params);

  try {
    newCustomer.update().then(function () {
      // if(req.decoded.role === 'admin') {
      new Customer({}).all().then(function (customerList) {
        res.send(customerList);
      });
      // } else {
      // 	new Customer({}).allByUserId(req.decoded.id).then(function(customerList) {
      // 		res.send(customerList);
      // 	});
      // }
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = { add: add, all: all, filter: filter, update: update, getById: getById };