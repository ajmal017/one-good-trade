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
  this.route('accountList', {
    path: '/',
    template: 'accountList',
    onRun: function() {
      Session.set("activePage", "accountList");
    },
  });

  this.route('watchlist', {
    path: '/watchlist',
    template: 'watchlist',
    onRun: function() {
      Session.set("activePage", "watchlist");
    },
  });

  this.route('sectorEtfs', {
    path: '/sectorEtfs',
    template: 'sectorEtfs',
    onRun: function() {
      Session.set("activePage", "sectorEtfs");
    },
  });

  this.route('bondsCommodities', {
    path: '/bondsCommodities',
    template: 'bondsCommodities',
    onRun: function() {
      Session.set("activePage", "bondsCommodities");
    },
  });

  this.route('weeklies', {
    path: '/weeklies',
    template: 'weeklies',
    onRun: function() {
      Session.set("activePage", "weeklies");
    },
  });
});

