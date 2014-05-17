ts_setting = {
	'host': "tradestation.com/v2",
	'apiKey': "",
	'secret': "",
	'environment': "PROD",
	'refreshID' : 0,
};


host = "";
if (ts_setting.environment == "SIM") {
	host = "https://sim.api." + ts_setting.host;
} else if (ts_setting.environment == "PROD") {
	host = "https://api." + ts_setting.host;
}
