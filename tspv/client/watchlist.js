Template.watchlist.helpers({
  watchlist: function() {
    return Watchlist.find();
  }
});


Template.watchlist.events({
  'click #addWatchlist' : function(e) {
    var symbol = $("#symbolInput").val();
    if (symbol) {
      var data = {
        Symbol: symbol
      };

      Watchlist.insert(data);
      showSimpleNotification(symbol.toUpperCase() +" added to watchlist.");
    }
  },
})

Template.watchlistSymbol.events({
  'click .addToWatchlist' : function(e) {
    var symbol = e.currentTarget.id.replace("addToWatchlist_","");
    if (symbol) {
      var data = {
        Symbol: symbol
      };

      Watchlist.insert(data);
      showSimpleNotification(symbol.toUpperCase() +" added to watchlist.");
    }
  },

  'click .removeSymbol' : function(e) {
    var symbol = e.currentTarget.id.replace("removeSymbol_","");
    var watchlistItem = Watchlist.findOne({
      Symbol:symbol
    })
    Watchlist.remove({
      _id: watchlistItem._id
    });
    showSimpleNotification(symbol +" removed from watchlist.");
  },

  'click .viewTradeIdeas' : function(e) {
    var symbol = e.currentTarget.id.replace("viewTradeIdeas_", "");
    var url = "http://www.trade-ideas.com/ticky/ticky.html?symbol=" + symbol;
    window.open(url, "_blank");
  }
});