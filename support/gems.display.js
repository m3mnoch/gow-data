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

		$("#filterbox").keyup(function() {
			gems.display.applyKeywordFilters();
		});

		$(".troopFilter").click(function() {
			gems.display.applyKeywordFilters();
		});
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
		$("#kingdomFilter").append('<label for="kingdom-' + kingdom + '" class="pure-checkbox"><input id="kingdom-' + kingdom + '" class="troopFilter" type="checkbox" value="' + kingdom + '"> ' + kingdom + '</label>');
	});

	types.sort();
	$.each(types, function(i, type) {
		$("#typeFilter").append('<label for="type-' + type + '" class="pure-checkbox"><input id="type-' + type + '" class="troopFilter" type="checkbox" value="' + type + '"> ' + type + '</label>');
	});

	rarities.sort();
	$.each(rarities, function(i, rarity) {
		$("#rarityFilter").append('<label for="rarity-' + rarity + '" class="pure-checkbox"><input id="rarity-' + rarity + '" class="troopFilter" type="checkbox" value="' + rarity + '"> ' + rarity + '</label>');
	});

}

gems.display.applyKeywordFilters = function() {

	$("#trooplist tbody").empty();
	$("#trooplist").append("");

	var troopFilters = [];

	$.each($('.troopFilter'), function( key, val ) {
		gems.common.log("checking: " + $(val).is(":checked"));

		if ($(val).is(":checked")) {
			troopFilters.push($(val).val());
		}		
	});
	gems.common.log("current filters: " + troopFilters);

	$.each(gems.common.troops, function(troopName, troopData) {
		//gems.common.log("search index: " + troopData['index']);

		var canDisplay = true;

		// first, search the input field for general text.
		if (troopData['index'].toLowerCase().indexOf($("#filterbox").val().toLowerCase()) < 0) {
			canDisplay = false;
		}

		// then, check the filter checkboxes
		$.each(troopFilters, function(i, filterWord) {
			if (canDisplay) {
				// find |filterWord| in the index field.
				//gems.common.log("searching for: |" + filterWord + "|");

				if (troopData['index'].toLowerCase().indexOf('|' + filterWord.toLowerCase() + "|") < 0) {
					canDisplay = false;
				}
			}
		});

		// draw them if we can.
		if (canDisplay) {
			gems.common.log("adding " + troopName + " to list");
			var newTroop = $('<tr></tr>');
			// <th>image</th><th>Name</th><th>Color</th><th>Cost</th><th>Kingdom</th><th>Type</th><th>Rarity</th>
			newTroop.append('<td class="' + troopData.rarity.toLowerCase().replace(" ", "-") + 'Troop"><a href="#' + encodeURIComponent(troopData.name) + '"><img src="' + troopData.image + '" class="tableImage"></a></td>');
			newTroop.append('<td class="' + troopData.rarity.toLowerCase().replace(" ", "-") + 'Troop"><a href="#' + encodeURIComponent(troopData.name) + '">' + troopData.name + '</a></td>');
			newTroop.append('<td class="' + troopData.rarity.toLowerCase().replace(" ", "-") + 'Troop"><a href="#' + encodeURIComponent(troopData.name) + '">' + troopData.color + '</a></td>');
			newTroop.append('<td class="' + troopData.rarity.toLowerCase().replace(" ", "-") + 'Troop"><a href="#' + encodeURIComponent(troopData.name) + '">' + troopData.spell.spellCost + '</a></td>');
			newTroop.append('<td class="' + troopData.rarity.toLowerCase().replace(" ", "-") + 'Troop"><a href="#' + encodeURIComponent(troopData.name) + '">' + troopData.kingdom + '</a></td>');
			newTroop.append('<td class="' + troopData.rarity.toLowerCase().replace(" ", "-") + 'Troop"><a href="#' + encodeURIComponent(troopData.name) + '">' + troopData.type + '</a></td>');
			newTroop.append('<td class="' + troopData.rarity.toLowerCase().replace(" ", "-") + 'Troop"><a href="#' + encodeURIComponent(troopData.name) + '">' + troopData.rarity + '</a></td>');

			newTroop.click(function() {
				gems.display.showTroop(troopName);
			});

			$("#trooplist tbody").append(newTroop);
		}
	});

	gems.display.showList();
	
}

gems.display.showTroop = function(troopName) {
	if ($("#troopView").find('troopName').text() == troopName) {
		$("#troopView").show();
		gems.common.log("reusing " + troopName + " display");
		return;
	}

	gems.common.log("building new " + troopName + " display");
	$("#troopView").empty();
	$("#templates .troopCard").clone().appendTo("#troopView");

	var displayTroop = $("#troopView .troopCard");
	var troopData = gems.common.troops[troopName];
	
	displayTroop.find(".troopImage").attr("src", troopData.image);
	displayTroop.find(".troopName").text(troopData.name);
	displayTroop.find(".troopColor").text(troopData.color);
	displayTroop.find(".troopRarity").text(troopData.rarity);
	displayTroop.find(".troopKingdom").text(troopData.kingdom);
	displayTroop.find(".troopType").text(troopData.type);
	displayTroop.find(".troopFlavor").text(troopData.flavor);

	displayTroop.find(".spellImage").attr("src", troopData.spell.spellImage);
	displayTroop.find(".spellName").text(troopData.spell.spellName);
	displayTroop.find(".spellCost").text(troopData.spell.spellCost);
	displayTroop.find(".spellDesc").text(troopData.spell.spellDesc);

	for (var i=0; i<troopData.life.length; i++) {
		displayTroop.find('.progressionHealth').append('<td>' + troopData.life[i] + '</td>');
		displayTroop.find('.progressionArmor').append('<td>' + troopData.armor[i] + '</td>');
		displayTroop.find('.progressionAttack').append('<td>' + troopData.attack[i] + '</td>');
		displayTroop.find('.progressionMagic').append('<td>' + troopData.magic[i] + '</td>');
	}

	$("#troopView").show();
}

gems.display.showList = function(troopName) {
	$("#troopView").hide();
	$("#troopList").show();
	$("#trooplist").tablesorter();
}



