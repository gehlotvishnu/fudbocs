const Customer = require("../models/customer.js")

const add = function(req, res, next){
    let params = {
					createdBy: 'Admin',
					name: req.body.firstName,
					// uniqueKey: uuid(),
					address:req.body.cityName,
					email: req.body.email,
					gender: req.body.sex,
					mobileNo: req.body.mobile,
					remark: req.body.remark 
			};
    const newCustomer= new Customer(params);

    try {
        newCustomer.add().then(function() {
					// if(req.decoded.role === 'admin') {
						new Customer({}).all().then(function(customerList) {
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

const all = function(req, res, next){
	try {
		// if(req.decoded.role === 'admin') {
			new Customer({}).all().then(function(customerList) {
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

const filter = function(req, res, next){
	try {
		params = {
			date: req.query.date ? new Date(req.query.date) : new Date(),
			tiffinType: req.query.tiffinType ? req.query.tiffinType.split(',') : [1, 2, 3, 4]
		}
		// if(req.decoded.role === 'admin') {
			new Customer({}).filter(params).then(function(customerList) {
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

module.exports = {add: add, all: all, filter: filter};