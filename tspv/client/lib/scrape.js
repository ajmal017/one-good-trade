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
      Session.set("stockticker_age_" + symbol, new Date());

      /*
      var obj = jQuery.parseJSON( data.substr(3));
      data = obj[0];

      var price = data["l"];

      var pendingStocks = Session.get("stockticker_pending_list");
      var index = pendingStocks.indexOf(symbol);
      pendingStocks.splice(index, 1);
      Session.set("stockticker_pending_list", pendingStocks);

      Session.set("stockticker_" + symbol, price);
      Session.set("stockticker_age_" + symbol, new Date());
      */
    },
  });

/* fancy tradestation scrape
  var url = host + "/data/quote/" + symbol;

  $.ajax(url, {
    type: "GET",
    dataType: "jsonp",
    data: {
      "oauth_token" : token
    },
    error: function(xhr, status, error) {
      console.log(error);
    },
    success: function(data) {
      data = data[0];
      var bid = data["Bid"];
      var ask = data["Ask"];
      var price = (bid + ask ) / 2;

      console.log(symbol + " : " + price);

      var pendingStocks = Session.get("stockticker_pending_list");
      var index = pendingStocks.indexOf(symbol);
      pendingStocks.splice(index, 1);
      Session.set("stockticker_pending_list", pendingStocks);

      Session.set("stockticker_" + symbol, price);
      Session.set("stockticker_age_" + symbol, new Date());
    },
  });
*/

  // Wait for async to finish before returning
  // the result
}