// import config from 'config';
import { post } from '../httpClient';

export const login = function (username, password) {
	return new Promise(function (resolve, reject) {
			post(`api/auth/login`, { 'userName': username, 'password': password})
			.then(user => {
        if (user) {
					// store user details and basic auth credentials in local storage 
					// to keep user logged in between page refreshes
					
					user.authdata = window.btoa(username + ':' + password);
					localStorage.setItem('fudbocs', JSON.stringify(user));
					resolve();
				}
				
				reject('Error');
    }).catch(err => {
				console.log(err);
				err.response ? reject(err.response.data.error) : reject(err.message);
			});
    });
}

export const logout = function() {
    // remove user from local storage to log user out
    localStorage.removeItem('fudbocs');
}

// function getName() {
//     // remove user from local storage to log user out
//     JSON.parse(localStorage.getItem('user')).result;
// }