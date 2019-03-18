// Returns an array of days between the two dates
const getDays = function(startDate, endDate, exclude_MON, exclude_TUE, exclude_WED, exclude_THU, exclude_FRI, exclude_SAT, exclude_SUN) {
    var days = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };    
    while (currentDate <= endDate) {

        /*if(!isWeekend) {
            if(!is_weekend(currentDate)) {
                days.push(currentDate.getDate());
            }
        } else{
            days.push(currentDate.getDate());
        }*/
        if(currentDate.getDay()==0 && exclude_SUN==0){        
            days.push(currentDate.getDate());
        }else if(currentDate.getDay()==1 && exclude_MON==0){
            days.push(currentDate.getDate());
        }else if(currentDate.getDay()==2 && exclude_TUE==0){
            days.push(currentDate.getDate());
        }else if(currentDate.getDay()==3 && exclude_WED==0){
            days.push(currentDate.getDate());
        }else if(currentDate.getDay()==4 && exclude_THU==0){
            days.push(currentDate.getDate());
        }else if(currentDate.getDay()==5 && exclude_FRI==0){
            days.push(currentDate.getDate());
        }else if(currentDate.getDay()==6 && exclude_SAT==0){
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