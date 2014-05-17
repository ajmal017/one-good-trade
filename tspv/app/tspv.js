if (Meteor.isClient) {
  Template.accountList.helpers({
    accounts: function () {
      return Session.get("accounts");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
