const connection = require("../lib/connection.js");
let Schedule = function(params){
    this.createdBy = 'Admin',
    this.customerId = params.customerId,
    this.date = params.date,
    this.tiffinList = params.tiffin,
    this.daySchedule = params.daySchedule,
    this.id = params.id,
	this.isActive = params.isActive
};

Schedule.prototype.add = function(){
	const that = this;
	return new Promise(function(resolve, reject) {
	    connection.getConnection(function(error, connection){
            if (error) {
                throw error;
            }

            let values = [
                [that.customerId, that.date.getFullYear(), (that.date.getMonth() + 1), that.isActive, that.createdBy]
            ]

            connection.query("INSERT INTO schedule(customerId,year,month,isActive,createdBy) VALUES ?", [values], function(error,rows,fields){
                    if(!error){ 

                        that.daySchedule.map((day) => {
                            that.tiffinList.map((tiffin) => {
                                let values1 = [
                                    [rows.insertId, day, tiffin.tiffinType, tiffin.qty, tiffin.amount, that.isActive, that.createdBy]
                                ]
                                connection.query("INSERT INTO tiffin_schedule(scheduleId,day,tiffinType,qty,amount,isActive,createdBy) VALUES ?", [values1], function(error,rows,fields){
                                    if(!error){ 
                                        resolve(rows);
                                    } else {
                                        console.log("Error...", error);
                                        reject(error);
                                    }
                                });
			                });

                        })
                    } else {
                        console.log("Error...", error);
                        reject(error);
                    }
                });
            
            connection.release();
            console.log('Process Complete %d',connection.threadId);
		});
	});
};

Schedule.prototype.getBy = function(customerId, date){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select s.id, c.name, ts.day, ts.tiffinType, ts.qty, ts.amount from schedule s inner join tiffin_schedule ts on s.id = ts.scheduleId inner join customer c on s.customerId = c.id where ts.isActive=? and year=? and month=? and customerId=?', [isActive, date.getFullYear(), (date.getMonth() + 1), customerId], function(error,rows,fields){
			 
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

Schedule.prototype.getByCustomerId = function(customerId, date){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}

			const isActive = 1;

			connection.query('select s.id, c.name, ts.day, ts.tiffinType, ts.qty, ts.amount from schedule s inner join tiffin_schedule ts on s.id = ts.scheduleId inner join customer c on s.customerId = c.id where ts.isActive=? and year=? and month=? and c._id=(unhex(\'' + customerId + '\'))', [isActive, date.getFullYear(), (date.getMonth() + 1)], function(error,rows,fields){
			 
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

Schedule.prototype.update = function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
        connection.getConnection(function(error, connection){
            if (error) {
                throw error;
            }

            that.tiffinList.map((tiffin) => { 
                let values = [tiffin.qty, tiffin.amount, tiffin.isActive || 0, that.date.getDate(), that.id, tiffin.tiffinType];

                connection.query('UPDATE tiffin_schedule set qty = ?, amount = ?, isActive = ? where day = ? and scheduleId = ? and tiffinType = ?', values, function(error,rows,fields){
                    if(!error){ 
                        resolve(rows);
                    } else {
                        console.log("Error...", error);
                        reject(error);
                    }
                });
            });

            connection.release();
            console.log('Process Complete %d',connection.threadId);
        });
    });
}

module.exports = Schedule;
