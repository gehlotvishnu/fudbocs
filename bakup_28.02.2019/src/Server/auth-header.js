export function authHeader() {
    // return authorization header with basic auth credentials
    let user = JSON.parse(localStorage.getItem('fudbocs'));

    if (user && user.token) {
        return { 'Authorization': 'Basic ' + user.token };
    } else {
        return {};
    }
}