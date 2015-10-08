// IB format by default
getOptionDataFromSymbol = function(symbolStr) {
  symbolStr = symbolStr.replace(/\s+/g, ' ');
  var parts = symbolStr.split(" ");

  var data = {
    symbol : parts[0]
  };

  if (parts.length > 1) {
    var opt = parts[1].split("C");

    if (opt.length > 1) {
      data["type"] = "C";
      data["strike"] = parseInt(opt[1]) / 1000;
      var exp = opt[0];
      var year = parseInt("20"+exp.substring(0,2));
      var month = parseInt(exp.substring(2,4));
      var day = parseInt(exp.substring(4,6));

      data["exp"] = new Date(year, month-1, day);
    }
    else {
      opt = parts[1].split("P");
      if (opt.length > 1) {
        data["type"] = "P";
        data["strike"] = parseInt(opt[1]) / 1000;
        var exp = opt[0];
        var year = parseInt("20"+exp.substring(0,2));
        var month = parseInt(exp.substring(2,4));
        var day = parseInt(exp.substring(4,6));

        data["exp"] = new Date(year, month-1, day);
      }
    }
  }

  return data;
};

getOptionDataFromSymbolTS = function(symbolStr) {
  var parts = symbolStr.split(" ");

  var data = {
    symbol : parts[0]
  };

  if (parts.length > 1) {
    var opt = parts[1].split("C");
    if (opt.length > 1) {
      data["type"] = "C";
      data["strike"] = parseInt(opt[1]);
      var exp = opt[0];
      var year = parseInt("20"+exp.substring(0,2));
      var month = parseInt(exp.substring(2,4));
      var day = parseInt(exp.substring(4,6));

      data["exp"] = new Date(year, month-1, day);
    }
    else {
      opt = parts[1].split("P");
      if (opt.length > 1) {
        data["type"] = "P";
        data["strike"] = parseInt(opt[1]);
        var exp = opt[0];
        var year = parseInt("20"+exp.substring(0,2));
        var month = parseInt(exp.substring(2,4));
        var day = parseInt(exp.substring(4,6));

        data["exp"] = new Date(year, month-1, day);
      }
    }
  }

  return data;
};