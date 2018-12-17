import axios from 'axios';
import { parseXml, xmlToJson } from './parseXML';

export const saveSchedule = function (shedule) {
    return new Promise(function (resolve, reject) {
        axios('api/saveSchedule', {
            method: 'POST',
            data: shedule
        }).then(res => {
            resolve(res.data);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export const updateSchedule = function (shedule) {
    return new Promise(function (resolve, reject) {
        axios('api/updateSchedule', {
            method: 'POST',
            data: shedule
        }).then(res => {
            resolve(res.data);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}



export const saveCustomer = function (customer) {
    return new Promise(function (resolve, reject) {
        axios('api/saveCustomer', {
            method: 'POST',
            data: customer
        }).then(res => {
            resolve(res.data);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

export const getCustomers = function (query) {
    return new Promise(function (resolve, reject) {
        axios('api/getCustomers', {
            method: 'GET',
        }).then(res => {
            resolve(res.data);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    })
}

export const getSchedule = function (query) {
    return new Promise(function (resolve, reject) {
        axios('api/getSchedule?customerId=' + query.customerId + '&date' + query.date, {
            method: 'GET',
        }).then(res => {
            resolve(res.data);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    })
}

//Ender\'s+Game