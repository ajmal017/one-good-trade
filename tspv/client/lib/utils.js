showSimpleNotification = function(text) {
  new PNotify({
      text: text,
      type: 'info',
      icon : false,
      animate_speed: 'fast'
  });
}

showSimpleError = function(text) {
  new PNotify({
      text: text,
      type: 'error',
      animate_speed: 'fast'
  });
}

calculateWeekendDays = function (fromDate, toDate){
    var weekendDayCount = 0;

    while(fromDate < toDate){
        fromDate.setDate(fromDate.getDate() + 1);
        if(fromDate.getDay() === 0 || fromDate.getDay() == 6){
            ++weekendDayCount ;
        }
    }

    return weekendDayCount ;
}