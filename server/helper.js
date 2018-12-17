// Returns an array of dates between the two dates
const getDates = function(startDate, endDate, tiffin, isWeekend) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {

        if(!isWeekend) {
            if(!is_weekend(currentDate)) {
                dates.push({date: (currentDate.getFullYear() + "-" +(currentDate.getMonth() + 1) + "-" + currentDate.getDate()), tiffin});
            }
        } else{
            dates.push({date: (currentDate.getFullYear() + "-" +(currentDate.getMonth() + 1) + "-" + currentDate.getDate()), tiffin});
        }

      currentDate = addDays.call(currentDate, 1);
    }


    return {[startDate.getMonth() + 1] : dates};
  };

const is_weekend =  function(date1){
    var dt = new Date(date1);
     
    if(dt.getDay() == 6 || dt.getDay() == 0)
       {
        return true;
        } 
}

module.exports = {
    getDates: getDates,
    is_weekend: is_weekend
}