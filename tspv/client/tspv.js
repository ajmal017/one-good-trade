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

Template.accountList.helpers({
  accounts: function() {
    return Accounts.find();
    //return Session.get("accounts");
  }
});

Template.accountList.rendered = function() {
  pullAccounts();
  accountList_refresh = setInterval( refreshCharts, 15000);
}

Template.symbol.helpers({
  currentTimestamp: function() {
    return (new Date()).getTime();
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

Template.weeklies.events({
  'click #getWeeklies' : function(e) {
    token = getTSToken();
    Meteor.call("refreshWeeklies", token);
  }
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
      Meteor.call("replaceAccounts", data);
      pullPositions();
    }
  });
}


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

      var accounts = Accounts.find().fetch();
      for (var i=0; i < accounts.length; i++) {
        account = accounts[i];
        account.positions = [];
      }

      for (var i=0; i < data.length; i++) {
        var pos = data[i];

        for (var j=0; j < accounts.length; j++) {
          account = accounts[j];
          if (account.DisplayName == pos.DisplayName) {
            // found it, add it
            addPositionToAccount(pos, account);
            break;
          }
        }
      }


      Meteor.call("replaceAccounts", accounts);
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
