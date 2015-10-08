Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading'
});

Router.map(function () {
  /**
   * The route's name is "appList"
   * The route's template is also "appList"
   * The default action will render the appList template
   */
  this.route('accountListIB', {
    path: '/',
    template: 'accountListIB',
    waitOn: function() {
      return [
        Meteor.subscribe('accounts'),
        Meteor.subscribe('positions')
      ]
    },
    onBeforeAction: function() {
      Session.set("activePage", "accountListIB");
      this.next();
    },
  });

  this.route('accountListTS', {
    path: '/tradeStation',
    template: 'accountListTS',
    waitOn: function() {
      return [
        Meteor.subscribe('accounts'),
        Meteor.subscribe('positions')
      ]
    },
    onBeforeAction: function() {
      Session.set("activePage", "accountListTS");
      this.next();
    },
  });

  this.route('watchlist', {
    path: '/watchlist',
    template: 'watchlist',
    waitOn: function() {
      return [
        Meteor.subscribe('watchlist'),
      ]
    },
    onBeforeAction: function() {
      Session.set("activePage", "watchlist");
      this.next();
    },
  });

  this.route('sectorEtfs', {
    path: '/sectorEtfs',
    template: 'sectorEtfs',
    onBeforeAction: function() {
      Session.set("activePage", "sectorEtfs");
      this.next();
    },
  });

  this.route('bondsCommodities', {
    path: '/bondsCommodities',
    template: 'bondsCommodities',
    onBeforeAction: function() {
      Session.set("activePage", "bondsCommodities");
      this.next();
    },
  });

  this.route('weeklies', {
    path: '/weeklies',
    template: 'weeklies',
    waitOn: function() {
      return [
        Meteor.subscribe('weeklies'),
      ]
    },
    onBeforeAction: function() {
      Session.set("activePage", "weeklies");
      this.next();
    },
  });

  this.route('pnl', {
    path: '/pnl',
    template: 'pnl',
    waitOn: function() {
      return [
        Meteor.subscribe('accounts'),
        Meteor.subscribe('positions'),
        Meteor.subscribe('orders'),
      ]
    },
    onBeforeAction: function() {
      Session.set("activePage", "pnl");
      this.next();
    }
  });
});

