const connection = require("../lib/connection.js");

let Schedule = function(params){

    this.id = params.id,
    this.customerId= params.customerId,
    this.date=params.date,
    this.tiffinList= params.tiffin,    
    this.isActive= params.isActive,        
    this.breakfast= params.breakfast,
    this.breakfast_qty= params.breakfast, 
    this.breakfast_amount= params.breakfast_amount, 
    this.lunch=params.lunch, 
    this.lunch_qty= params.lunch_qty, 
    this.lunch_amount= params.lunch_amount, 
    this.dinner=params.dinner, 
    this.dinner_qty= params.dinner_qty, 
    this.dinner_amount= params.dinner_amount,  
    this.exclude_MON= params.exclude_MON, 
    this.exclude_TUE= params.exclude_TUE, 
    this.exclude_WED= params.exclude_WED,  
    this.exclude_THU= params.exclude_THU, 
    this.exclude_FRI= params.exclude_FRI,  
    this.exclude_SAT= params.exclude_SAT,  
    this.exclude_SUN= params.exclude_SUN,        
    this.createdBy= params.createdBy,
    this.daySchedule =params.daySchedule,

    
    //array of days of month which will be affected by Startfromdt or Stopfromdt
    this.CalenderDays=params.CalenderDays,
    this.dateTimeModified=params.dateTimeModified


};

Schedule.prototype.add = function(){
    const that = this; 
	return new Promise(function(resolve, reject) {
	    connection.getConnection(function(error, connection){
            if (error) {
                throw error;
            }

            let values = [
                [that.customerId, that.date.getFullYear(), (that.date.getMonth() + 1), that.isActive,that.breakfast,that.breakfast_qty,that.breakfast_amount,that.lunch,that.lunch_qty,that.lunch_amount,that.dinner,that.dinner_qty,that.dinner_amount,that.exclude_MON,that.exclude_TUE, that.exclude_WED, that.exclude_THU, that.exclude_FRI, that.exclude_SAT, that.exclude_SUN,  that.createdBy]
            ]           
            connection.query("INSERT INTO schedule(customerId,year,month,isActive,breakfast, breakfast_qty, breakfast_amount, lunch, lunch_qty, lunch_amount, dinner, dinner_qty, dinner_amount, exclude_MON, exclude_TUE, exclude_WED, exclude_THU, exclude_FRI, exclude_SAT, exclude_SUN,createdBy) VALUES ?", [values], function(error,rows,fields){
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
					console.log('Get Schedule Process Complete %d',connection.threadId);
				});
		});
	});
};

Schedule.prototype.ScheduleExist = function(customerId, date){
	return new Promise(function(resolve, reject) {
		connection.getConnection(function(error, connection){
			if (error) {
				throw error;
			}
			const isActive = 1;
			connection.query('select count(*) as schedule_exist from schedule where isActive=? and year=? and month=? and customerId=?', [isActive, date.getFullYear(), (date.getMonth() + 1),customerId], function(error,rows,fields){
			 
					if(!error){                       
						resolve(rows[0]);
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
                let values1 = [that.id, that.date.getDate(), tiffin.tiffinType];

                connection.query("SELECT 1 FROM tiffin_schedule WHERE scheduleId = ? and day = ? and tiffinType = ? LIMIT 1", values1, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    
                    if (results.length === 0) {
                        let values = [
                            [that.id, that.date.getDate(), tiffin.tiffinType, tiffin.qty, tiffin.amount, that.isActive, that.createdBy]
                        ]

                        connection.query("INSERT INTO tiffin_schedule(scheduleId,day,tiffinType,qty,amount,isActive,createdBy) VALUES ?", [values], function(error,rows,fields){
                            if(!error){ 
                                resolve(rows);
                                
                            } else {
                                console.log("Error...", error);
                                reject(error);
                            }
                        });
                    } else {
                        let values = [tiffin.qty, tiffin.amount, tiffin.isActive, that.dateTimeModified, that.createdBy, that.date.getDate(), that.id, tiffin.tiffinType];
                        
                        connection.query('UPDATE tiffin_schedule set qty = ?, amount = ?, isActive = ?, dateTimeModified = ?, updatedBy = ? where day = ? and scheduleId = ? and tiffinType = ?', values, function(error,rows,fields){
                            if(!error){ 
                                resolve(rows);
                            } else {
                                console.log("Error...", error);
                                reject(error);
                            }
                        });
                    }
                });
            });

            connection.release();
            console.log('Schedule Update Process Complete %d',connection.threadId);
        });
    });
}

Schedule.prototype.updatefrom = function(data) {
    const that = this;
    return new Promise(function(resolve, reject) {
        connection.getConnection(function(error, connection){
            if (error) {
                throw error;
            }

        /*//get indexes for loop
        var index1=0;
        var index2=0;
        var year=0;
        var month=0;
        //start and stop are date string in 'DD-MM-YYYY'
        if(that.stopFromdt=='' && that.startFromdt!=''){
            index1=that.startFromdt.substr(0,2);   
            
            year= that.startFromdt.substr(6);
            month=that.startFromdt.substr(3,2)-1;        
            index2=new Date(month, year, 0).getDate();  
        }
        if(that.startFromdt=='' && that.stopFromdt!=''){
            index1=that.stopFromdt.substr(0,2);               
            
            year=that.stopFromdt.substr(6);
            month= that.stopFromdt.substr(3,2)-1;
            index2=new Date(month, year, 0).getDate();     
        }
        if(that.startFromdt!='' && that.stopFromdt!=''){
        index1=that.stopFromdt.substr(2);   
        index2=that.startFromdt.substr(2);

        year= that.startFromdt.substr(6);
        month=that.startFromdt.substr(3,2);  
        }    
        //for loop for each day
        var i;
        console.log('index1-'+ index1);
        console.log('index2-'+ index2);
        for( i=index1;i<=index2;i++)
        {*/

        that.CalenderDays.map((day) => {                     
            that.tiffinList.map((tiffin) => { 
                
                let values1 = [that.id, day, tiffin.tiffinType];
                connection.query("SELECT 1 FROM tiffin_schedule WHERE scheduleId = ? and day = ? and tiffinType = ? LIMIT 1", values1, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }                    
                    if (results.length === 0) {
                        let values = [
                            [that.id, day, tiffin.tiffinType, tiffin.qty, tiffin.amount, that.isActive, that.createdBy]
                        ]
                        connection.query("INSERT INTO tiffin_schedule(scheduleId,day,tiffinType,qty,amount,isActive,createdBy) VALUES ?", [values], function(error,rows,fields){
                            if(!error){ 
                                resolve(rows);
                                
                            } else {
                                console.log("Error...", error);
                                reject(error);
                            }
                        });
                    } else {
                        let values = [tiffin.qty, tiffin.amount, tiffin.isActive, that.dateTimeModified, that.createdBy,day, that.id, tiffin.tiffinType];                        
                        connection.query('UPDATE tiffin_schedule set qty = ?, amount = ?, isActive = ?, dateTimeModified = ?, updatedBy = ? where day = ? and scheduleId = ? and tiffinType = ?', values, function(error,rows,fields){
                            if(!error){ 
                                resolve(rows);
                            } else {
                                console.log("Error...", error);
                                reject(error);
                            }
                        });
                    }
                });
            });
        })        

            connection.release();
            console.log('Schedule Updatefrom Process Complete %d',connection.threadId);
        });
    });
}

module.exports = Schedule;
