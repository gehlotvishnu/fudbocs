// var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb://mukesh:dhrDG!421@foodbox-shard-00-00-ogufn.mongodb.net:27017,foodbox-shard-00-01-ogufn.mongodb.net:27017,foodbox-shard-00-02-ogufn.mongodb.net:27017/foodbox?ssl=true&replicaSet=foodbox-shard-0&authSource=admin&retryWrites=true";

// MongoClient.connect(uri, function(err, client) {
//     console.log("Connection Opened");
// });

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
    saveSchedule(scheduler) {
        return new Promise(function (resolve, reject) {
            scheduler.save()
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
                console.log(customera);
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
                console.log(schedule);
                if(schedule.length > 0) {
                    resolve({_id: schedule[0]._id, monthSchedule: schedule[0].TiffinSchedule[0][date1.getFullYear()][date1.getMonth() + 1]});
                } else {
                    resolve({});
                }
            });
        });
    }
}
