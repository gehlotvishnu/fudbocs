import axios from 'axios';

export const saveSchedule = function (shedule) {
    return new Promise(function (resolve, reject) {
        axios('/api/schedule/add', {
            method: 'POST',
            data: shedule
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

export const updateSchedule = function (shedule) {
    return new Promise(function (resolve, reject) {
        axios('/api/schedule/update', {
            method: 'POST',
            data: shedule
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

export const saveCustomer = function (customer) {
    return new Promise(function (resolve, reject) {
        axios('/api/customer/add', {
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
        axios('/api/customer/all', {
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
        axios('/api/schedule/getBy?customerId=' + query.customerId + '&date=' + query.date + '&role=' + query.role, {
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

export const filterCustomer = function (date, tiffinType) {
    return new Promise(function (resolve, reject) {
        axios('/api/customer/filter?date=' + date + '&tiffinType=' + tiffinType, {
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