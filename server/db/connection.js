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

                schedule.markModified('Date');
                schedule.Date[newSchedule.index].tiffin = newSchedule.tiffin;

                schedule.save(function (err, data) {
                    if (err) throw err;

                    Schedule.find({CustomerId: Object(newSchedule.customerId)}, function(err, schedule) {
                        if (err) throw err;
                    
                        // object of all the customera
                        console.log(schedule);
                        resolve(schedule);
                    });
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
    getSchedule(customerId) {
        return new Promise(function (resolve, reject) {
            // get all the customer
            Schedule.find({CustomerId: Object(customerId)}, function(err, schedule) {
                if (err) throw err;
            
                // object of all the customera
                console.log(schedule);
                resolve(schedule);
            });
        });
    }
}
