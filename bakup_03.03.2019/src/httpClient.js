import axios from 'axios';
import { authHeader } from './Server/auth-header';

let url = window.location.href
let arr = url.split("/");
let host = arr[0] + "//" + arr[2] + '/'

export const post = function(uri, data) {
	return new Promise(function (resolve, reject) {
			axios(host + uri, {
					method: 'POST',
					data: data,
					headers: authHeader()
			}).then(res => {
					resolve(res.data);
			}).catch(err => {
							console.log(err);
							reject(err);
					});
	});
}

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
            data: customer,
            headers: authHeader()
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
            headers: authHeader()
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
            headers: authHeader()
        }).then(res => {
            resolve(res.data);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    })
}

export const editSaveCustomer = function (customer) {
    return new Promise(function (resolve, reject) {       
        axios('/api/customer/update', {
            method: 'POST',
            data: customer,
            headers: authHeader()
        }).then(res => {          
            resolve(res.data);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

//Ender\'s+Game