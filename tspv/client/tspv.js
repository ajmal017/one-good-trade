Meteor.subscribe('accounts');
Meteor.subscribe('positions');
Meteor.subscribe('watchlist');
Meteor.subscribe('weeklies');

Template.layout.rendered = function() {
  if (!this.rendered) {
    this.rendered = true;

    loginTS();

    // Calls refresh every minute
    ts_setting.refreshID = setInterval( refreshTS, 120000);
  }
};

Template.layout.events({
  'click #navAuthenticate' : function(e) {
    authUrl = getTSLoginUrl();
    window.location = authUrl;
  },

  'click #tester' : function(e) {
    alert(amplify.store('ts_token'));
  }
});

Template.layout.helpers({
  isAccountList: function() {
   return "accountList" == Session.get("activePage");
  },
  isWatchlist: function() {
   return "watchlist" == Session.get("activePage");
  },
  isSectorEtfs: function() {
   return "sectorEtfs" == Session.get("activePage");
  },
  isBondsCommodities: function() {
   return "bondsCommodities" == Session.get("activePage");
  },
  isMonthlies: function() {
   return "monthlies" == Session.get("activePage");
  },
})

Template.account.helpers({
  BuyingPowerPercentage: function() {
    return Math.round(this.RealTimeBuyingPower / this.RealTimeEquity * 10000) / 100;
  },
})

Template.accountList.helpers({
  accounts: function() {
    return Accounts.find();
  },
});


Template.accountList.rendered = function() {
  pullAccounts();
  accountList_refresh = setInterval( refreshCharts, 15000);
}

Template.symbolPosition.helpers({
  isOption: function() {
    var parts = this.Symbol.split(" ");
    if (parts.length > 1)
      return true;
    else
      return false;
  },

  Delta: function() {
    var data = getOptionDataFromSymbol(this.Symbol);
    var today = getToday();
    var date_delta = daysBetween(today, data["exp"]);
    var option_price = (this.AskPrice + this.BidPrice) / 2;
    var stock_price = Session.get("stockticker_" + data["symbol"]);
    var strike_price = data["strike"];

    var old_price = Session.get("stockticker_" + data["symbol"]);
    var age = Session.get("stockticker_age_" + data["symbol"]);
    var now = new Date();

    if (now - age < 60 * 1000) {
      var stock_price = old_price;
    }
    else {
      getStockPrice(data["symbol"]);
      return "...";
    }

    if (!(date_delta && option_price && stock_price)) return "...";

    var iv = get_iv(
      (data["type"] == "C"),      
      stock_price,
      strike_price,
      0,
      date_delta,
      option_price
    );

    var greeks = black_scholes(
      (data["type"] == "C"),
      stock_price,
      strike_price,
      0,
      iv,
      date_delta/365
    );

    return Math.round(greeks["delta"] * 1000) / 1000;
  },

  Theta: function() {
    var data = getOptionDataFromSymbol(this.Symbol);
    var today = getToday();
    var date_delta = daysBetween(today, data["exp"]);
    var option_price = (this.AskPrice + this.BidPrice) / 2;
    var strike_price = data["strike"];

    var old_price = Session.get("stockticker_" + data["symbol"]);
    var age = Session.get("stockticker_age_" + data["symbol"]);
    var now = new Date();

    // cache for 1 min
    if (now - age < 60 * 1000) {
      var stock_price = old_price;
    }
    else {
      getStockPrice(data["symbol"]);
      return "...";
    }

    if (!(date_delta && option_price && stock_price)) return "...";

    var iv = get_iv(
      (data["type"] == "C"),
      stock_price,
      strike_price,
      0,
      date_delta,
      option_price
    );

    var greeks = black_scholes(
      (data["type"] == "C"),
      stock_price,
      strike_price,
      0,
      iv,
      date_delta/365
    );

    return Math.round(greeks["theta"] * 100000 / 365) / 100000;
  }
});

Template.symbol.helpers({
  currentTimestamp: function() {
    return (new Date()).getTime();
  },

  TotalOpenProfitLoss: function() {
    var sum = 0;
    this.Positions.forEach(function(pos) {
      sum += pos.OpenProfitLoss;
    });

    return sum;
  }
});

Template.earnings.rendered = function() {
  symbol = this.data.Symbol
  var date = Meteor.call("getNextEarningDate", this.data.Symbol,
      partial(makeEarningsCallback, symbol));
}

Template.earnings.helpers({
  sanitizedSymbol: function() {
    return sanitizeSymbolForHtmlId(this.Symbol);
  },
});

function makeEarningsCallback(symbol, error, result) {
  if (result) {
    $("#earnings_" + sanitizeSymbolForHtmlId(symbol)).html(result);
  }
  else {
    $("#earnings_" + sanitizeSymbolForHtmlId(symbol)).html("error");
  }
}


getTSToken = function() {
  return amplify.store('ts_token');
}

function loginTS() {
  var queryStrings = getQueryStringParts();

  if (queryStrings["logout"]) {
    logoutTS();
  }

  token = amplify.store("ts_token");

  console.log("TOKEN " + token);

  if (token) {
    updateLoginState(token);
  }
  else {

    if (queryStrings["code"]) {
      var codeUrl = host + "/security/authorize";
      uri = String(window.location).split("?")[0];
      var params = {
        grant_type: "authorization_code",
        client_id: ts_setting.apiKey,
        redirect_uri: uri,
        code: queryStrings["code"],
        client_secret: ts_setting.secret
      };

      $.post(codeUrl, params,
        function(data) {
          amplify.store("ts_token", data["access_token"]);
          amplify.store("ts_userid", data["userid"]);
          amplify.store("ts_refresh_token", data["refresh_token"]);

          window.location = String(window.location).split("?")[0];
        }
      );

    }
    else {
      updateLoginState(false);
    }
  }
}


// Similar to a logout
function logoutTS() {
  amplify.store("ts_token",null);
  window.location = String(window.location).split("?")[0];
}


function updateLoginState(token) {
  if(token) {
    $('#navAuthenticate').addClass('hidden');
    $('.authenticated').removeClass('hidden');
  }
  else {
    $('#navAuthenticate').removeClass('hidden');
    $('.authenticated').addClass('hidden');
  }
}


function pullAccounts() {
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

function pullAccount(accountKey) {
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
function pullPositions() {
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
function addPositionToAccount(pos, account) {
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
}



// TradeStation HTML Features //

function getTSLoginUrl() {
  var authUrl = host + "/authorize" +
    "?response_type=code" +
    "&client_id=" + ts_setting.apiKey +
    "&redirect_uri=" + window.location;

  return authUrl;
}

function refreshCharts() {
  console.log("refreshing charts");
  $("img.charts").each(function(i) {
    var src = $(this).attr('src');
    src = src.split("&ts=")[0] + "&ts=" + (new Date()).getTime();
    $(this).attr('src',src);
  });
}

function refreshTS() {
  var codeUrl = host + "/security/authorize";
  uri = String(window.location).split("?")[0];
  var params = {
    grant_type: "refresh_token",
    client_id: ts_setting.apiKey,
    redirect_uri: uri,
    client_secret: ts_setting.secret,
    refresh_token: amplify.store("ts_refresh_token")
  };

  pullAccounts();

  $.post(codeUrl, params,
    function(data) {
      amplify.store("ts_token", data["access_token"]);
    }
  );
}
