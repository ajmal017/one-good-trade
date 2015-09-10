UI._allowJavascriptUrls()

UI.registerHelper('proxyUrl', function () {
  if (_proxyUrl) {
    return _proxyUrl;
  }
  else {
    return "";
  }
});