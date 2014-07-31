Template.weeklies.events({
  'click #getWeeklies' : function(e) {
    token = getTSToken();
    Meteor.call("refreshWeeklies", token);
  }
});


Template.weeklies.helpers({
  weeklies: function() {
    return Weeklies.find({}, {sort:{Symbol:1}});
  }
})
