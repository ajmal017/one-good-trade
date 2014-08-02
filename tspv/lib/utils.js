getQueryStringParts = function() {
  a = window.location.search.substr(1).split('&');
  if (a == "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i)
  {
    var p=a[i];
    var index = p.indexOf("=");
    if (index == -1) continue;

    var key = p.substr(0,p.indexOf("="));
    var val = p.substr(p.indexOf("=")+1);
    b[key] = decodeURIComponent(val.replace(/\+/g, " "));
  }
  return b;
}


// Good for server only really
makeHttpCall = function(method, url, params, max_retry) {
  var retry = 0;
  if (!max_retry) max_retry = 4;
  if (!params) params = {};

  while (retry < max_retry) {
    try {
      var result = HTTP.call(method, url, params);
      return result;
    }
    catch(e) {
      //console.log("makeHttpCall error: " + url + " : " + e.message);
      retry++;
    }
  }

  return null;
}


partial = function( fn /*, args...*/) {
  var aps = Array.prototype.slice,
    args = aps.call( arguments, 1 );
  
  return function() {
    return fn.apply( this, args.concat( aps.call( arguments ) ) );
  };
}

sanitizeSymbolForHtmlId = function(symbol) {
  return symbol.replace('$','');
}

if (Meteor.isClient) {
  UI.registerHelper('sanitizeSymbolForHtmlId', function (symbol) {
    sanitizeSymbolForHtmlId(symbol);
  });
}

treatAsUTC = function(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

getToday = function() {
  today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

daysBetween = function(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}