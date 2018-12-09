const moment = require('moment');

export const getDaysInMonth = function(month,year) {
    month = month + 1;
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return moment(year + "-" + month).daysInMonth();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
};

export const getMonth = function(d){
    var month=['January','February','March','April','May','June','July','August','September','October','November','December'];
 
    return month[d]
};

export const getTodaysDate = function() {
    return moment();
}

// export const getMonth = function(date) {
//     return moment(date).getMonth();
// }