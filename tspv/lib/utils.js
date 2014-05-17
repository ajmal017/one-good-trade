getQueryStringParts = function() {
  a = window.location.search.substr(1).split('&');
  if (a == "") return {};
  var b = {};
  for (var i = 0; i < a.length; ++i)
  {
    var p=a[i];
    var index = p.indexOf("=");
    if (index == -1) continue;

    var key = p.substr(0,p.indexOf("="));
    var val = p.substr(p.indexOf("=")+1);
    b[key] = decodeURIComponent(val.replace(/\+/g, " "));
  }
  return b;
}