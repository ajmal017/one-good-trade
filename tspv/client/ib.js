Template.accountListIB.helpers({
  positions : function() {
    var pos = Positions.find().fetch();
    var output = {};

    pos.forEach(function(po) {
      var symbol = po.Symbol.split(" ")[0];

      if (!output.hasOwnProperty(symbol)) {
        output[symbol] = {
          Symbol : symbol,
          Positions : [],
        }
      }
      output[symbol]["Positions"].push(po);
    });

    var result = [];
    var keys = Object.keys(output);
    keys.forEach(function(key) {
      result.push(output[key]);
    });

    result.sort(function(a,b) {
      if (a.Symbol > b.Symbol) return 1;
      else if (a.Symbol < b.Symbol) return -1;
      else return 0;
    });

    return result;
  }
});

Template.accountListIB.events({
  "click #syncAccountBtn" : function() {
    Meteor.call("syncIB", function(err, result) {

    });
  },
});

Template.accountListIB.rendered = function() {
  accountList_refresh = setInterval( refreshCharts, 15000);
}