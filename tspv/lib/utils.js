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
  return new Date();
}

getStartOfToday = function() {
  var today = getToday();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

getEndOfToday = function() {
  var startOfToday = getStartOfToday();
  return new Date(startOfToday.getTime() + (24 * 60 * 60 * 1000 * 1));
}

getStartOfXDaysAgo = function(days) {
  var startOfToday = getStartOfToday();
  return new Date(startOfToday.getTime() - (24 * 60 * 60 * 1000 * days));
}

getEndOfXDaysAgo = function(days) {
  var startOfToday = getStartOfToday();
  return new Date(startOfToday.getTime() - (24 * 60 * 60 * 1000 * (days-1)));
}


daysBetween = function(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

// takes CSV, assumes first line is column name, returns array of associative obj
parseCSV = function(csv) {
  var lines = csv.split("\n");
  var header = lines[0];
  var columns = header.split(",");
  columns = _.map(columns, function(c) { return c.replace(/"/g,''); });

  var results = [];
  for(var i=1; i < lines.length; i++) {
    var result = {};
    var fields = lines[i].split(",");

    if (fields.length != columns.length) continue;

    fields = _.map(fields, function(f) { return f.replace(/"/g,''); });

    for(var j=0; j < fields.length; j++) {
      result[columns[j]] = fields[j];
    }
    results.push(result);
  }

  return results;
}