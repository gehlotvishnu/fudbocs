const connection = require("../lib/connection.js");
let Customer = function(params){
    this.name = params.name,
    this.address = params.address,
    // this.uniqueKey = params.uniqueKey,
    this.gender = params.gender,
    this.mobileNo = params.mobileNo,
	this.email = params.email,
	this.remark = params.remark,
    this.createdBy = params.createdBy,
	this.isActive = 1
};

Customer.prototype.add = function(){
	const that = this;
	return new Promise(function(resolve, reject) {
	connection.getConnection(function(error, connection){
		if (error) {
			throw error;
		}

		connection.query('INSERT INTO customer(_id, name,address,email,gender,mobileNo,remark,isActive,createdBy) VALUES (unhex(replace(uuid(),"-",""))' + ',"' + that.name + '","' + that.address + '","' + that.email + '","' + that.gender + '","' + that.mobileNo + '","' + that.remark + '","'+ that.isActive + '","'+ that.createdBy + '")', function(error,rows,fields){
				if(!error){ 
					resolve(rows);
				} else {
					console.log("Error...", error);
					reject(error);
				}

				connection.release();
				console.log('Process Complete %d',connection.threadId);
			});
		});
	});
};

Customer.prototype.all = function(){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select id, hex(_id) as _id, name, address, email, gender, mobileNo, remark, dateTimeCreated from customer where isActive=?', [isActive], function(error,rows,fields){
			 
					if(!error){ 
						resolve(rows);
					} else {
						console.log("Error...", error);
						reject(error);
					}

					connection.release();
					console.log('Process Complete %d',connection.threadId);
				});
		});
	});
};

module.exports = Customer;