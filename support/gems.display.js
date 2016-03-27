$.namespace('gems.display');

gems.display.init = function() {
	gems.common.log("display script loaded.");
	gems.display.loadTroopData();
}

gems.display.loadTroopData = function() {
	$.getJSON( "support/gems.troops.json", function(data) {
		gems.common.troops = data;
		$("#loadMessage").hide();
		$("#troopForm").show();
	});
}

gems.display.applyKeywordFilters = function() {
	//str.toLowerCase();
}



