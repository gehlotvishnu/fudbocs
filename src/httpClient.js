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

export const saveSchedule = function (schedule) {
    return new Promise(function (resolve, reject) {
        axios('/api/schedule/add', {
            method: 'POST',
            data: schedule,
            headers: authHeader()
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
            data: shedule,
            headers: authHeader()
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

export const updateScheduleFrom = function (schedule) {
    return new Promise(function (resolve, reject) {
        axios('/api/schedule/updatefrom', {
            method: 'POST',
            data: schedule,
            headers: authHeader()
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

export const CheckScheduleExist = function (query) {
    return new Promise(function (resolve, reject) {           
        axios('/api/schedule/exist?customerId=' + query.customerId + '&date=' + query.date + '&role=' + query.role, {
            method: 'GET',
            headers: authHeader()
        }).then(res => {           
            resolve(res.data.schedule_exist);
          
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

export const getCustomersById = function (customerId) {
    return new Promise(function (resolve, reject) {
        axios('/api/customer/getById?customerId=' + customerId, {
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


//Ender\'s+Game