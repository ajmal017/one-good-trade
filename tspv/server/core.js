Meteor.methods({
  // wipes all positions and then add what's passed in
  updatePositions : function(positions) {
    Positions.remove({});

    positions.forEach(function(pos) {
      Positions.insert(pos);
    });
  },
});