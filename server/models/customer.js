const connection = require("../lib/connection.js");
let Customer = function(params){
	this.id= params.id,
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

Customer.prototype.filter = function(params){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select c.id, hex(_id) as _id, name, address, email, gender, mobileNo, remark, c.dateTimeCreated from customer c inner join schedule s on c.id = s.customerId inner join tiffin_schedule ts on s.id = ts.scheduleId where c.isActive=? and s.year = ? and s.month = ? and ts.day = ? and ts.tiffinType in (?) and ts.isActive = 1', [isActive, params.date.getFullYear(), params.date.getMonth() + 1, params.date.getDate(), params.tiffinType], function(error,rows,fields){
			 
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

Customer.prototype.update = function(){
	const that = this;
	return new Promise(function(resolve, reject) {
	connection.getConnection(function(error, connection){
		if (error) {
			throw error;
		}

		connection.query('UPDATE customer SET name="' + that.name + '",address="' + that.address + '",email="' + that.email + '",gender="' + that.gender + '",mobileNo="' + that.mobileNo + '",remark="' + that.remark + '" where id=' + that.id , function(error,rows,fields){
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