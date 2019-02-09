const Schedule = require("../models/schedule.js")
const {getDays} = require('../helper');

const add = function(req, res, next){
    const daySchedule = getDays(new Date(req.body.startDate), new Date(req.body.endDate), req.body.isWeekend);

    let params = {
        createdBy: 'Admin',
        customerId: req.body.customerId,
        date:new Date(req.body.startDate),
        tiffin: req.body.bill,
        daySchedule: daySchedule,
        isActive: req.body.isActive || 0
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

module.exports = {add: add, getBy: getBy, update: update};