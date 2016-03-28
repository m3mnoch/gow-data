$.namespace('gems.display');

gems.display.init = function() {
	gems.common.log("display script loaded.");
	gems.display.loadTroopData();
}

gems.display.loadTroopData = function() {
	$.getJSON(gems.common.troopDataUrl, function(data) {
		gems.common.troops = data;
		gems.display.buildKeywordFilters();

		$("#loadMessage").hide();
		$("#troopForm").show();
	});
}

gems.display.buildKeywordFilters = function() {
	var kingdoms = [];
	var types = [];
	var rarities = [];

	$.each(gems.common.troops, function(troopName, troopData) {
		if ($.inArray(gems.common.troops[troopName]['kingdom'], kingdoms) < 0) {
			kingdoms.push(gems.common.troops[troopName]['kingdom']);
		}

		if ($.inArray(gems.common.troops[troopName]['type'], types) < 0) {
			types.push(gems.common.troops[troopName]['type']);
		}

		if ($.inArray(gems.common.troops[troopName]['rarity'], rarities) < 0) {
			rarities.push(gems.common.troops[troopName]['rarity']);
		}
	});

	kingdoms.sort();
	$.each(kingdoms, function(i, kingdom) {
		$("#kingdomFilter").append('<label for="kingdom-' + kingdom + '" class="pure-checkbox"><input id="kingdom-' + kingdom + '" type="checkbox" value="' + kingdom + '"> ' + kingdom + '</label>');
	});

	types.sort();
	$.each(types, function(i, type) {
		$("#typeFilter").append('<label for="type-' + type + '" class="pure-checkbox"><input id="type-' + type + '" type="checkbox" value="' + type + '"> ' + type + '</label>');
	});

	rarities.sort();
	$.each(rarities, function(i, rarity) {
		$("#rarityFilter").append('<label for="rarity-' + rarity + '" class="pure-checkbox"><input id="rarity-' + rarity + '" type="checkbox" value="' + rarity + '"> ' + rarity + '</label>');
	});

}

gems.display.applyKeywordFilters = function() {
	//str.toLowerCase();
}



