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

refreshCharts = function() {
  console.log("refreshing charts");
  $("img.charts").each(function(i) {
    var src = $(this).attr('src');
    src = src.split("&ts=")[0] + "&ts=" + (new Date()).getTime();
    $(this).attr('src',src);
  });
}

