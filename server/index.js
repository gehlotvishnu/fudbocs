const axios = require('axios');
const goodreadsapi = require('./config');
const goodreadsUri = 'https://www.goodreads.com';
const Customer = require('./schema/customer');
const Scheduler= require('./schema/schedule');

const {getDates} = require('./helper');

const { saveCustomer, getCustomer, saveSchedule, getSchedule, updateSchedule, filterCustomer } = require('./db/connection');

module.exports = {
    
    updateSchedule(data) {
        return new Promise(function (resolve, reject) {
            let tiffin = {};
            let scheduler = {};

            data.bill.map(function(obj) {
                if(obj.tiffinType === '1') {
                    tiffin.launch = {amount: Number(obj.amount), qty: Number(obj.qty)};
                } 
                
                if(obj.tiffinType === '2') {
                    tiffin.dinner = {amount: Number(obj.amount), qty: Number(obj.qty)};
                } 
                
                if(obj.tiffinType === '4') {
                    tiffin.breakFast = {amount: Number(obj.amount), qty: Number(obj.qty)};
                }
            });

            scheduler.customerId = data.customerId;
            scheduler.Id = new Object(data._id);
            scheduler.Date = new Date(data.date)
            scheduler.index = data.index;
            scheduler.tiffin = tiffin;

            return updateSchedule(scheduler).then(function(data) {
                resolve(data);
            });
        });
    },
    saveSchedule(data) {
        return new Promise(function (resolve, reject) {
            scheduler = new Scheduler();
            let tiffin = {};

            data.bill.map(function(obj) {
                if(obj.tiffinType === '1') {
                    tiffin.launch = {amount: Number(obj.amount), qty: Number(obj.qty)};
                } 
                
                if(obj.tiffinType === '2') {
                    tiffin.dinner = {amount: Number(obj.amount), qty: Number(obj.qty)};
                } 
                
                if(obj.tiffinType === '4') {
                    tiffin.breakFast = {amount: Number(obj.amount), qty: Number(obj.qty)};
                }
            });
           
            const dateSchedule = getDates(new Date(data.startDate), new Date(data.endDate), tiffin, data.isWeekend);
            const date = new Date(data.startDate);
            let obj = {
                [date.getFullYear()]: dateSchedule
            }

            scheduler.CustomerId = new Object(data.customerId);
            scheduler.TiffinSchedule = obj
            return saveSchedule(scheduler, date).then(function(data) {
                resolve(data);
            });
        });
    },
    saveCustomer(data) {
        return new Promise(function (resolve, reject) {
            customer = new Customer()
            customer.FirstName = data.firstName;
            customer.LastName = data.lastName;
            customer.MiddleName = data.middleNam
            customer.Mobile = data.mobile;
            customer.Email = data.email;
            customer.CityName = data.cityName;
            customer.Remark = data.remark;
            customer.Sex = data.sex;

            return saveCustomer(customer).then(function(data) {
                return getCustomer().then(function(customers) {
                    resolve(customers);
                })
            });
        });
    },
    getCustomers() {
        return new Promise(function (resolve, reject) {
            return getCustomer().then(function(customers) {
                resolve(customers);
            })
        });
    },
    getSchedule(customerId, date) {
        return new Promise(function (resolve, reject) {
            return getSchedule(customerId, date).then(function(schedule) {
                resolve(schedule);
            })
        });
    },
    filterCustomer(date, tiffinType) {
        return new Promise(function (resolve, reject) {
            return filterCustomer(date, tiffinType).then(function(schedule) {
                resolve(schedule);
            })
        });
    }
};