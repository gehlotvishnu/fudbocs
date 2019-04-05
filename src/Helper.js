const moment = require('moment');

export const getDaysInMonth = function (month, year) {
  month = month + 1;
  // Here January is 1 based
  //Day 0 is the last day in the previous month
  return moment(year + "-" + month).daysInMonth();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
};

export const getMonth = function (d) {
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return month[d]
};

export const getTodaysDate = function () {
  return moment();
}

export const getTodaysDateWithTime = function () {
  return new moment().format("DD-MM-YYYY HH:mm:ss");
}

export const getTodaysDateMMDDYYYY = function () {
  return new moment().format("DD-MM-YYYY");
}

export const convertDate = function (inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}
// export const getMonth = function(date) {
//     return moment(date).getMonth();
// }