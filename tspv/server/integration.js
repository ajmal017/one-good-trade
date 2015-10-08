Meteor.methods({
  syncIB : function() {
    var token = "135684957050629436785474";
    var query_id = "177398";
    var url = "https://gdcdyn.interactivebrokers.com/Universal/servlet/FlexStatementService.SendRequest?t=" + token + "&q=" + query_id + "&v=3"

    var headers = {
      "User-Agent" : "Java"
    };
    var params = {};
    params["headers"] = headers;

    var result = HTTP.call("GET", url, params);
    var content = result.content;
    var data = xml2js.parseStringSync(content);

    try {
      var reference_code = data["FlexStatementResponse"]["ReferenceCode"][0];
    }
    catch (e) {
      console.log("syncIB - can't get reference code : " + content + ", " + e);
      return;
    }

    var url = "https://gdcdyn.interactivebrokers.com/Universal/servlet/FlexStatementService.GetStatement?q=" + reference_code + "&t=" + token + "&v=3"

    var result = HTTP.call("GET", url, params);
    var content = result.content;

    var data = parseCSV(content);


    Meteor.call("updatePositions", data);
  }
});