const Schedule = require("../models/schedule.js")
const {getDays} = require('../helper');

const add = function(req, res, next){
    //get array of days after exlusion like mon,tue etc.
    const daySchedule = getDays(new Date(req.body.startDate), new Date(req.body.endDate), req.body.exclude_MON,req.body.exclude_TUE,req.body.exclude_WED,req.body.exclude_THU,req.body.exclude_FRI,req.body.exclude_SAT,req.body.exclude_SUN);

    let params = {       
        customerId: req.body.customerId,
        date:new Date(req.body.startDate),
        tiffin: req.body.bill,       
        isActive: req.body.isActive || 0,        
        breakfast: req.body.breakfast,
        breakfast_qty: req.body.breakfast, 
        breakfast_amount: req.body.breakfast_amount, 
        lunch:req.body.lunch, 
        lunch_qty: req.body.lunch_qty, 
        lunch_amount: req.body.lunch_amount, 
        dinner:req.body.dinner, 
        dinner_qty: req.body.dinner_qty, 
        dinner_amount: req.body.dinner_amount,  
        exclude_MON: req.body.exclude_MON, 
        exclude_TUE: req.body.exclude_TUE, 
        exclude_WED: req.body.exclude_WED,  
        exclude_THU: req.body.exclude_THU, 
        exclude_FRI: req.body.exclude_FRI,  
        exclude_SAT: req.body.exclude_SAT,  
        exclude_SUN: req.body.exclude_SUN,        
        createdBy: req.body.createdBy,
        daySchedule : daySchedule
    };    
    const newSchedule= new Schedule(params);

    try {
        newSchedule.add().then(function() {
            new Schedule({}).getBy(params.customerId, params.date).then(function(scheduleList) {
                res.send(scheduleList);
            });
		});
    } catch (err) {
			console.log("Error: ", err);
    }
};

const exist = function(req, res, next){
	try {        
        let date = req.query.date ? new Date(req.query.date) : new Date();
        new Schedule({}).ScheduleExist(req.query.customerId, date).then(function(status) {
        res.send(status);
            });
         
 } catch (err) {
	 console.log("Error: ", err);
 }
}




const getBy = function(req, res, next){
	try {
        let date = req.query.date ? new Date(req.query.date) : new Date();

        if(req.query.role === 'admin') {
            new Schedule({}).getBy(req.query.customerId, date).then(function(schedules) {
                res.send(schedules);
            });
        } else {
            new Schedule({}).getByCustomerId(req.query.customerId, date).then(function(schedules) {
                res.send(schedules);
            });
        }
 } catch (err) {
	 console.log("Error: ", err);
 }
}

const update = function(req, res, next) {
    try {
        let params = {
            createdBy: req.body.role || 'user',
            customerId: req.body.customerId,
            date:req.body.date ? new Date(req.body.date) : new Date(),
            id: req.body._id,
            tiffin: req.body.bill,
            role: req.body.role,
            isNew: req.body.isNew,
            isActive: req.body.isActive,
            dateTimeModified: new Date()
        };      
        const newSchedule= new Schedule(params);

        newSchedule.update().then(function() {
            if(params.role === 'admin') {
                new Schedule({}).getBy(params.customerId, params.date).then(function(schedules) {                  
                    res.send(schedules);
                });
            } else {
                new Schedule({}).getByCustomerId(params.customerId, params.date || new Date()).then(function(schedules) {
                    res.send(schedules);
                });
            }
        });
    } catch (err) {
        console.log("Error: ", err);
    }
}

const updatefrom = function(req, res, next) {
    try {
        let params = {
            customerId : req.body.customerId,
            id : req.body.scheduleId,           
            tiffin: req.body.bill,       
            role: req.body.role,
            createdBy: req.body.role || 'user',
            date:req.body.date ? new Date(req.body.date) : new Date(),      
            isActive: req.body.isActive,
            CalenderDays: req.body.CalenderDays,
            dateTimeModified: new Date()
        };
        
        const newSchedule= new Schedule(params);
        newSchedule.updatefrom().then(function() { 
            new Schedule({}).getBy(params.customerId, params.date).then(function(schedules) {                
                res.send(schedules);
        });      
        }); 

    } catch (err) {
        console.log("Error: ", err);
    }
}

module.exports = {add: add, exist:exist,getBy: getBy, update: update,updatefrom:updatefrom};