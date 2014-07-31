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
  },
})
