
pullAccounts = function() {
  token = amplify.store("ts_token");
  if (!token) return;

  var url = host + "/users/" + amplify.store("ts_userid") + "/accounts";

  $.ajax(url, {
    type: "GET",
    data: {
      oauth_token: token
    },
    error: function(xhr, status, error) {
      if (error == "Unauthorized") {
        logoutTS();
      }
    },
    success: function(data) {
      console.log(data);
      data.forEach(function(account) {
        pullAccount(account['Key']);
      });
    }
  });
}

pullAccount = function(accountKey) {
  token = amplify.store("ts_token");
  if (!token) return;

  var url = host + "/accounts/" + accountKey + "/balances";

  $.ajax(url, {
    type: "GET",
    data: {
      oauth_token: token
    },
    error: function(xhr, status, error) {
      if (error == "Unauthorized") {
        logoutTS();
      }
    },
    success: function(data) {
      var url = host + "/accounts/" + accountKey + "/positions";
      $.ajax(url, {
        type: "GET",
        data: {
          oauth_token: token
        },
        error: function(xhr, status, error) {
          if (error == "Unauthorized") {
            logoutTS();
          }
        },
        success: function(positions) {
          positions.forEach(function(pos){
            addPositionToAccount(pos, data[0]);
          })
          Meteor.call("replaceAccount", data[0]);
        }
      });
    }
  });
}

// NOTE: CURRENTLY UNUSED
pullPositions = function() {
  token = amplify.store("ts_token");
  if (!token) return;

  var url = host + "/users/" + amplify.store("ts_userid") + "/positions";

  $.ajax(url, {
    type: "GET",
    data: {
      oauth_token: token
    },
    error: function(xhr, status, error) {
      console.log(xhr);
      console.log(status);
      console.log(error);
    },
    success: function(data) {
      Meteor.call("replacePositions", data);
    }
  });
}


// adding a position to account. we're doing some collation here because
// the positions are organized by symbols
// Format of a symbol:
// {
//   Symbol : XLK,
//   Description : "S&P Sel Technology Spdr Fund",
//   Positions : [ <position> ]
// }
addPositionToAccount = function(pos, account) {
  if (!account.Symbols)
    account.Symbols = [];

  // grab just the actual stock symbol, ignore the options bit
  var shortSymbol = pos.Symbol.split(" ")[0];
  var hasExisting = false;

  // check if we have same symbol
  for (var i=0; i < account.Symbols.length; i++) {
    var symbol = account.Symbols[i];
    if (symbol.Symbol == shortSymbol) {
      if (!symbol.Positions)
        symbol.Positions = [];
      symbol.Positions.push(pos);
      hasExisting = true;
      break;
    }
  }

  // if we didn't find existing
  if (!hasExisting) {
    symbol = {
      Symbol : shortSymbol,
      Description : pos.Description,
      Positions : []
    }
    symbol.Positions.push(pos);
    account.Symbols.push(symbol);
  }
};

updateOrdersForAllAccounts = function(callback) {
  token = amplify.store("ts_token");
  if (!token) return;

  var accounts = Accounts.find();

  var account_keys = [];
  accounts.forEach(function(account) {
    account_keys.push(account.Key);
  });

  var daysAgo = getStartOfXDaysAgo(14);

  var url = host + "/accounts/" + account_keys.join(",") + "/orders?since=" + moment(daysAgo).format('MM-DD-YYYY') + "&oauth_token=" + token;

  $.ajax(url, {
    type: "GET",
    data: {
    },
    error: function(xhr, status, error) {
      console.log(xhr);
      console.log(status);
      console.log(error);
    },
    success: function(orders) {
      orders.map(function(order) {
        order["_id"] = String(order["OrderID"]);
        return order;
      });

      Meteor.call("recordOrders", orders, function(err, result) {
        if(callback) {
          callback();
        }
      });
    }
  });  
};

logoutTS = function() {
  amplify.store("ts_token",null);
  window.location = String(window.location).split("?")[0];
}
