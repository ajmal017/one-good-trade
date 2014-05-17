
function applyTSToken(token) {
	$('div.authenticate').addClass('hidden');
	$('div.authenticated').removeClass('hidden');
}

function pullAccounts() {
	token = amplify.store("ts_token");
	var url = host + "/users/" + amplify.store("ts_userid") + "/accounts";

	$.ajax(url, {
		type: "GET",
		data: {
			oauth_token: token
		},
		error: function(xhr, status, error) {
			if (error == "Unauthorized") {
				logoutTS();
			}
		},
		success: function(data) {
			Session.set("accounts", data);
			pullPositions();
		}
	});

}

function pullPositions() {
	var url = host + "/users/" + amplify.store("ts_userid") + "/positions";

	$.ajax(url, {
		type: "GET",
		data: {
			oauth_token: token
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
		},
		success: function(data) {

			console.log(data);

			accounts = Session.get("accounts");

			for (var i=0; i < accounts.length; i++) {
				account = accounts[i];
				account.positions = [];
			}

			for (var i=0; i < data.length; i++) {
				var pos = data[i];

				for (var j=0; j < accounts.length; j++) {
					account = accounts[j];
					if (account.DisplayName == pos.DisplayName) {
						// found it, add it
						addPositionToAccount(pos, account);
						break;
					}
				}
			}

			Session.set("accounts", accounts);
		}
	});
}

// adding a position to account. we're doing some collation here because
// the positions are organized by symbols
// Format of a symbol:
// {
//   Symbol : XLK,
//   Description : "S&P Sel Technology Spdr Fund",
//   Positions : [ <position> ]
// }
function addPositionToAccount(pos, account) {
	if (!account.Symbols)
		account.Symbols = [];

	// grab just the actual stock symbol, ignore the options bit
	var shortSymbol = pos.Symbol.split(" ")[0];
	var hasExisting = false;

	// check if we have same symbol
	for (var i=0; i < account.Symbols.length; i++) {
		var symbol = account.Symbols[i];
		if (symbol.Symbol == shortSymbol) {
			if (!symbol.Positions)
				symbol.Positions = [];
			symbol.Positions.push(pos);
			hasExisting = true;
			break;
		}
	}

	// if we didn't find existing
	if (!hasExisting) {
		symbol = {
			Symbol : shortSymbol,
			Description : pos.Description,
			Positions : []
		}
		symbol.Positions.push(pos);
		account.Symbols.push(symbol);
	}
}

// Similar to a logout
function logoutTS() {
	amplify.store("ts_token",null);
	window.location = String(window.location).split("?")[0];
}

function getTSLoginUrl() {
	var authUrl = host + "/authorize" +
		"?response_type=code" +
		"&client_id=" + ts_setting.apiKey +
		"&redirect_uri=" + window.location;

	return authUrl;
}

function refreshTS() {
	var codeUrl = host + "/security/authorize";
	uri = String(window.location).split("?")[0];
	var params = {
		grant_type: "refresh_token",
		client_id: ts_setting.apiKey,
		redirect_uri: uri,
		client_secret: ts_setting.secret,
		refresh_token: amplify.store("ts_refresh_token")
	};

	$.post(codeUrl, params,
		function(data) {
			console.log(data);
			amplify.store("ts_token", data["access_token"]);
		}
	);
}

function loginTS() {
	var queryStrings = getQueryStringParts();

	if (queryStrings["logout"]) {
		logoutTS();
	}

	token = amplify.store("ts_token");

	if (token) {
		applyTSToken(token);
		pullAccounts();
	}
	else {

		if (queryStrings["code"]) {
			var codeUrl = host + "/security/authorize";
			uri = String(window.location).split("?")[0];
			var params = {
				grant_type: "authorization_code",
				client_id: ts_setting.apiKey,
				redirect_uri: uri,
				code: queryStrings["code"],
				client_secret: ts_setting.secret
			};

			$.post(codeUrl, params,
				function(data) {
					amplify.store("ts_token", data["access_token"]);
					amplify.store("ts_userid", data["userid"]);
					amplify.store("ts_refresh_token", data["refresh_token"]);
					applyTSToken(data["access_token"]);

					window.location = String(window.location).split("?")[0];
				}
			);

		}
		else {
			$('div.authenticate').removeClass("hidden");
			authUrl = getTSLoginUrl();
			$("a.authenticate").attr("href", authUrl);
			$("div.authenticated").addClass("hidden");
		}
	}

}

if (Meteor.isClient) {
	// Executed at start
	Template.layout.rendered = function() {
		if (!this.rendered) {
			this.rendered = true;

			loginTS();

			// Calls refresh every minute
			ts_setting.refreshID = setInterval( refreshTS, 60000);
		}
	};
}
