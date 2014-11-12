getStockPrice = function(symbol) {

  // see if we're pending already
  var pendingStocks = Session.get("stockticker_pending_list");
  if (!pendingStocks) pendingStocks = [];
  if (pendingStocks.indexOf(symbol) != -1) {
    return;
  }

  pendingStocks.push(symbol);
  Session.set("stockticker_pending_list", pendingStocks);

  var url = "http://finance.google.com/finance/info?client=ig&q=" + symbol;

  var url = "http://query.yahooapis.com/v1/public/yql?q=select%20LastTradePriceOnly%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + symbol + " %22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

  $.ajax(url, {
    type: "GET",
    dataType: "jsonp",
    error: function(xhr, status, error) {
      console.log(error);
    },
    success: function(data) {

      var price = parseFloat(data["query"]["results"]["quote"]["LastTradePriceOnly"]);

      var pendingStocks = Session.get("stockticker_pending_list");
      var index = pendingStocks.indexOf(symbol);
      pendingStocks.splice(index, 1);
      Session.set("stockticker_pending_list", pendingStocks);

      Session.set("stockticker_" + symbol, price);
      Session.set("stockticker_checked_on_" + symbol, new Date());
    },
  });
}

getStockATR = function(symbol) {
  // see if we're pending already
  var pendingStocks = Session.get("stockticker_atr_pending_list");
  if (!pendingStocks) pendingStocks = [];
  if (pendingStocks.indexOf(symbol) != -1) {
    return;
  }

  pendingStocks.push(symbol);
  Session.set("stockticker_atr_pending_list", pendingStocks);

  var url = '***REMOVED***' + "http://finviz.com/quote.ashx?t=" + symbol;
  HTTP.call("GET", url, function(err, result) {
    var regex = new RegExp('ATR</td><td width="8%" class="snapshot-td2" align="left"><b>([0-9.]*)</b></td>');
    var atr = regex.exec(result.content);

    var pendingStocks = Session.get("stockticker_atr_pending_list");
    var index = pendingStocks.indexOf(symbol);
    pendingStocks.splice(index, 1);
    Session.set("stockticker_atr_pending_list", pendingStocks);

    Session.set("stockticker_atr_" + symbol, parseFloat(atr[1]));
    Session.set("stockticker_atr_checked_on_" + symbol, new Date());
  });

}