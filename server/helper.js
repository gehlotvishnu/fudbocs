// Returns an array of days between the two dates
const getDays = function(startDate, endDate, isWeekend) {
    var days = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {

        if(!isWeekend) {
            if(!is_weekend(currentDate)) {
                days.push(currentDate.getDate());
            }
        } else{
            days.push(currentDate.getDate());
        }

      currentDate = addDays.call(currentDate, 1);
    }

    return days;
  };

const is_weekend =  function(date1){
    var dt = new Date(date1);
     
    if(dt.getDay() == 6 || dt.getDay() == 0)
       {
        return true;
        } 
}

module.exports = {
    getDays: getDays,
    is_weekend: is_weekend
}