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
  });
});

