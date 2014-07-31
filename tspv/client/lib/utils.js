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