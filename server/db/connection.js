// var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb://mukesh:dhrDG!421@foodbox-shard-00-00-ogufn.mongodb.net:27017,foodbox-shard-00-01-ogufn.mongodb.net:27017,foodbox-shard-00-02-ogufn.mongodb.net:27017/foodbox?ssl=true&replicaSet=foodbox-shard-0&authSource=admin&retryWrites=true";

// MongoClient.connect(uri, function(err, client) {
//     console.log("Connection Opened");
// });

const ObjectID = require('mongodb').ObjectID

const Customer = require('../schema/customer');
const Schedule = require('../schema/schedule');

module.exports = {
    updateSchedule(newSchedule) {
        return new Promise(function (resolve, reject) {
            // get all the customer
            Schedule.findById(Object(newSchedule.Id), function(err, schedule) {
                if (err) throw err;

                schedule.markModified('TiffinSchedule');

                if(newSchedule.index) {
                    schedule.TiffinSchedule[0][newSchedule.Date.getFullYear()][newSchedule.Date.getMonth() + 1][newSchedule.index].tiffin = newSchedule.tiffin;
                } else {
                    const obj = {date: newSchedule.Date.getFullYear() + "-" + (newSchedule.Date.getMonth() + 1) + "-" + newSchedule.Date.getDate(), tiffin: newSchedule.tiffin};
                    
                    schedule.TiffinSchedule[0][newSchedule.Date.getFullYear()][newSchedule.Date.getMonth() + 1].push(obj);
                }
                // schedule.Date[newSchedule.index].tiffin = newSchedule.tiffin;

                schedule.save(function (err, data) {
                    if (err) throw err;

                    resolve({_id: data._id, monthSchedule: data.TiffinSchedule[0][newSchedule.Date.getFullYear()][newSchedule.Date.getMonth() + 1]});
                  });
            });
        });
    },
    saveSchedule(scheduler, date) {
        return new Promise(function (resolve, reject) {
            // let query = {CustomerId: ObjectId(scheduler.CustomerId), $and:[{'TiffinSchedule.0.' + date.getFullYear() +'.' + (date.getMonth() + 1).toString() : { $exists : true }}]};
            let key = 'TiffinSchedule.0.'+ date.getFullYear()
            let query =  {CustomerId: ObjectID(scheduler.CustomerId), $and:[{[key] : { '$exists' : true }}]};
            // ['TiffinSchedule.0.'+ date.getFullYear() +'.' + (date.getMonth() + 1).toString()]
            //{CustomerId: ObjectId("5c2f2af134f7431f44de7724"), $and:[{'TiffinSchedule.0.2019.1': { '$exists' : true }}]}
            //{CustomerId: ObjectId("5c2f2af134f7431f44de7724"), $and:[{'TiffinSchedule.0.2019.2'}]: { "$exists" : true }}]}
            Schedule.find(query, function(err, schedule) {
                if (err) throw err;

                if(schedule.length > 0 && schedule[0].TiffinSchedule) {
                    if(schedule[0].TiffinSchedule[0][date.getFullYear()][date.getMonth() + 1]) {
                        // UPDATE existing schedule
                    } else {
                        schedule[0].TiffinSchedule[0][date.getFullYear()].push(scheduler.TiffinSchedule[0][date.getFullYear()][0]);
                        schedule[0].markModified('TiffinSchedule');

                        schedule[0].save()
                        .then(schedule => {
                            console.log(schedule);
                            if(schedule && schedule.TiffinSchedule[0][date.getFullYear()]) {
                                resolve({_id: schedule._id, monthSchedule: schedule.TiffinSchedule[0][date.getFullYear()][date.getMonth() + 1]});
                            } else {
                                resolve({});
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            reject(err);
                        });
                    }
                } else {
                    scheduler.save()
                    .then(schedule => {
                        console.log(schedule);
                        if(schedule && schedule.TiffinSchedule[0][date.getFullYear()]) {
                            resolve({_id: schedule._id, monthSchedule: schedule.TiffinSchedule[0][date.getFullYear()][date.getMonth() + 1]});
                        } else {
                            resolve({});
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        reject(err);
                    });
                }
            });
        });
    },
    saveCustomer(customer) {
        return new Promise(function (resolve, reject) {
            customer.save()
            .then(doc => {
                console.log(doc);
                resolve(doc);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
        });
    },
    getCustomer() {
        return new Promise(function (resolve, reject) {
            // get all the customer
            Customer.find({}, function(err, customera) {
                if (err) throw err;
            
                // object of all the customera
                // console.log(customera);
                resolve(customera);
            });
        });
    },
    getSchedule(customerId, date) {
        return new Promise(function (resolve, reject) {
            // get all the customer
            Schedule.find({CustomerId: Object(customerId)}, function(err, schedule) {
                if (err) throw err;
                
                const date1 = date ? new Date(date) : new Date();
                
                // object of all the customera
                // console.log(schedule);
                if(schedule.length > 0 && schedule[0].TiffinSchedule[0][date1.getFullYear()]) {
                    resolve({_id: schedule[0]._id, monthSchedule: schedule[0].TiffinSchedule[0][date1.getFullYear()][date1.getMonth() + 1]});
                } else {
                    resolve({});
                }
            });
        });
    },
    filterCustomer(date, tiffinType) {
        return new Promise(function (resolve, reject) {
            const newDate =  new Date(date);
            
            let Date1 = newDate.getFullYear() + '-' + (newDate.getMonth() + 1).toString() + '-' + newDate.getDate().toString();

            // { 'TiffinSchedule.0.2019.1': {$elemMatch: {date: '2019-1-1','tiffin.launch': { '$exists' : true }}} }
            let TiffinSchedule;

            if(tiffinType === '2') {
                TiffinSchedule = {['TiffinSchedule.0.'+ newDate.getFullYear() +'.' + (newDate.getMonth() + 1).toString()] : { $elemMatch: {date: Date1,['tiffin.dinner']: { '$exists' : true }}} };
            } else if(tiffinType === '1') {
                TiffinSchedule = {['TiffinSchedule.0.'+ newDate.getFullYear() +'.' + (newDate.getMonth() + 1).toString()] : { $elemMatch: {date: Date1,['tiffin.launch']: { '$exists' : true }}} };
            } else if(tiffinType === '4') {
                TiffinSchedule = {['TiffinSchedule.0.'+ newDate.getFullYear() +'.' + (newDate.getMonth() + 1).toString()] : { $elemMatch: {date: Date1,['tiffin.breakFast']: { '$exists' : true }}} };
            } else if(tiffinType === '3') {
                TiffinSchedule = {['TiffinSchedule.0.'+ newDate.getFullYear() +'.' + (newDate.getMonth() + 1).toString()] : { $elemMatch: {date: Date1,['tiffin.launch']: { '$exists' : true} , ['tiffin.dinner']: { '$exists' : true }}} };
            } else {
                tiffinType = undefined;
            }

            // let TiffinSchedule;
            
            // if(tiffinType) {
            //     TiffinSchedule = {['TiffinSchedule.0.'+ newDate.getFullYear() +'.' + (newDate.getMonth() + 1).toString()] : { $elemMatch: {date: Date1,['tiffin.' + tiffinType]: { '$exists' : true }}} };
            // } else {
            //     if(date !== "") {
            //         TiffinSchedule = {['TiffinSchedule.0.'+ newDate.getFullYear() +'.' + (newDate.getMonth() + 1).toString()] : { $elemMatch: {date: Date1}} };
            //     } else {
            //         TiffinSchedule = {};
            //     }
            // }

            // get all the customer
            Schedule.find(TiffinSchedule, function(err, schedule) {
                if (err) throw err;
                
                if(schedule.length > 0) {
                    resolve(schedule);
                } else {
                    resolve({});
                }
            });
        });
    }
}
