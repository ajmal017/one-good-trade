Cheerio = Meteor.npmRequire('cheerio');
cheerio = new Cheerio();

moment = Meteor.npmRequire('moment');

Meteor.methods({
  getNextEarningDate: function(symbol) {
    symbol = symbol.toLowerCase();
    var letter = symbol[0];
    var url = "http://biz.yahoo.com/research/earncal/" + letter + "/" + symbol + ".html";

    var result = makeHttpCall("GET",url, {}, 1);
    if (!result || !result.content) return "N/A";

    var $ = Cheerio.load(result.content);

    var tbl = $("form.yfi_biz_form table");
    var el = $("b", tbl);
    if (!el) return "N/A";

    var html = el.html();
    if (!el) return "N/A";
    
    var parts = el.html().split("\n");
    return parts[parts.length-1]

  },


  refreshWeeklies: function(token) {
    var url = "http://www.optionsclearing.com/webapps/weekly-options?action=download";
    var result = HTTP.call("POST", url);
    var result = result.content;

    var lines = result.split("\n");

    var symbols = [];
    var foundSymbols = false;
    for(var i=0; i < lines.length; i++) {
      if (!foundSymbols) {
        if (lines[i].indexOf("SYMBOL") == 0) {
          foundSymbols = true;
          continue;
        }
        else {
          continue;
        }
      }

      var parts = lines[i].split(",");
      var symbol = parts[0].trim();
      if (symbol && symbol.match(/\d/) == null) {
        symbols.push(symbol);
      }
    }

    Weeklies.remove({});
    symbols.forEach(function(symbol) {
      Weeklies.insert({
        Symbol:symbol
      });
    });
    return symbols;
  },

  recordOrders: function(orders) {
    orders.forEach(function(order) {
      Meteor.call("recordOrder", order);
    });
  },

  recordOrder: function(order) {
    found = Orders.findOne({_id: order._id});

    if (!found) {
      console.log("inserting order with id " + order._id);
      Orders.insert(order);
    }
  },

  replaceAccount: function(account) {
    Accounts.remove({
      Key : account['Key']
    });
    Accounts.insert(account);
  },

  replaceAccounts: function(accounts) {
    Accounts.remove({});
    for(i=0; i<accounts.length; i++) {
      var account = accounts[i];
      Accounts.insert(account);
    }
  },

  replacePositions: function(positions) {
    Positions.remove({});
    for(i=0; i<positions.length; i++) {
      var position = positions[i];
      Positions.insert(position);
    }
  },
});
