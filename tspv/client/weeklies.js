Template.weeklies.events({
  'click .removeSymbol' : function(e) {
    var symbol = e.target.id.replace("removeSymbol_","");
    var item = Weeklies.findOne({
      Symbol:symbol
    })
    Weeklies.remove({
      _id: item._id
    });
  },

  'click .addToWatchlist' : function(e) {
    var symbol = e.target.id.replace("addToWatchlist_","");
    var data = {
      Symbol: symbol
    };

    Watchlist.insert(data);
  }
});

Template.weeklies.helpers({
  weeklies: function() {
    return Weeklies.find({}, {sort:{Symbol:1}});
  }
})
