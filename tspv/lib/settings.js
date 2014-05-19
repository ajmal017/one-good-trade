ts_setting = {
	'host': "tradestation.com/v2",
	'apiKey': "20392797-CB3A-406C-A1DA-4E022F19CCBA",
	'secret': "799A18D4-DFBF-49C8-BE6B-02538EBE9A7D",
	'environment': "PROD",
	'refreshID' : 0,
};


host = "";
if (ts_setting.environment == "SIM") {
	host = "https://sim.api." + ts_setting.host;
} else if (ts_setting.environment == "PROD") {
	host = "https://api." + ts_setting.host;
}
