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

  $.ajax(url, {
    type: "GET",
    error: function(xhr, status, error) {
      console.log(error);
    },
    success: function(data) {
      var obj = jQuery.parseJSON( data.substr(3));
      data = obj[0];

      var price = data["l"];

      var pendingStocks = Session.get("stockticker_pending_list");
      var index = pendingStocks.indexOf(symbol);
      pendingStocks.splice(index, 1);
      Session.set("stockticker_pending_list", pendingStocks);

      Session.set("stockticker_" + symbol, price);
      Session.set("stockticker_age_" + symbol, new Date());
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