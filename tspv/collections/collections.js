Accounts = new Meteor.Collection('accounts');

Orders = new Meteor.Collection('orders');

Positions = new Meteor.Collection('positions');

Watchlist = new Meteor.Collection('watchlist');

Weeklies = new Meteor.Collection('weeklies');

// name
// symbols

if (Meteor.isServer) {
  Meteor.publish('accounts', function() {
    return Accounts.find();
  });

  Meteor.publish('positions', function() {
    return Positions.find();
  });

  Meteor.publish('watchlist', function() {
    return Watchlist.find();
  });

  Meteor.publish('weeklies', function() {
    return Weeklies.find();
  })
}

