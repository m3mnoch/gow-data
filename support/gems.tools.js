/*
	NOTE:  the project assumes this fancy php proxy (or similar)
	is in place in order to get around any cross-domain issues.
	so, the return format for ajax requests is:
	{
		status: {
			http_code: 200
		},
		contents: "... <html> ..."
	}

	// Script: Simple PHP Proxy: Get external HTML, JSON and more!
	//
	// *Version: 1.6, Last updated: 1/24/2009*
	// 
	// Project Home - http://benalman.com/projects/php-simple-proxy/
	// GitHub       - http://github.com/cowboy/php-simple-proxy/
	// Source       - http://github.com/cowboy/php-simple-proxy/raw/master/ba-simple-proxy.php
	// 
	// About: License
	// 
	// Copyright (c) 2010 "Cowboy" Ben Alman,
	// Dual licensed under the MIT and GPL licenses.
	// http://benalman.com/about/license/
	// 

*/

$.namespace('gems.tools');

gems.tools.proxyUrl = "http://m3mnoch.com/main/proxy/"
gems.tools.wikiBaseUrl = "http://gems-of-war.wikia.com"

gems.tools.parseList = [];

gems.tools.slug = {};
gems.tools.slug.troopList = "/wiki/Troops";
gems.tools.slug.kingdomList = "/wiki/Kingdoms";
gems.tools.slug.traitList = "/wiki/Traits";

gems.tools.init = function() {
	gems.common.log("tools script loaded.");

	$('#grabtroops').click(function() {
		gems.tools.updateTroopData();
	});
	
	$('#writejson').click(function() {
		gems.tools.dumpTroops();
	});
	
	$('#clearlog').click(function() {
		$('#gemlog').val('');
		gems.common.log("log cleared.");
	});
	
}


gems.tools.dumpTroops = function() {
	gems.common.log("dumping troop data.");
	var troopData = JSON.stringify(gems.common.troops, null, 2);
	$('#jsonbucket').val(troopData);
}

gems.tools.checkFinishedParsingTroops = function() {
	if (gems.tools.parseList.length == 0) {
		gems.tools.dumpTroops();
	} else {
		gems.common.log(gems.tools.parseList.length + " parse items remaining.");
	}
}

gems.tools.removeTroopParse = function(troopName) {
	for(var i = gems.tools.parseList.length; i--;) {
		if(gems.tools.parseList[i] === troopName) {
			gems.tools.parseList.splice(i, 1);
		}
	}
}


gems.tools.testTroopData = function() {
	$.getJSON(gems.common.troopDataUrl, function(data) {
		/*
		var items = [];
		$.each( data, function( key, val ) {
			items.push( "<li id='" + key + "'>" + val + "</li>" );
		});
		
		$( "<ul/>", {
			"class": "my-new-list",
			html: items.join( "" )
		}).appendTo( "body" );
		*/

		/*
		$.ajax({ url: gems.tools.proxyUrl + "?url=" + gems.tools.wikiBaseUrl + gems.tools.slug.troopList,
				dataType: 'xml',
				callback: function(returnData) { 
					var mydata = $(returnData).find('noscript');
					$('.after-me').html(mydata);
				}
		});
		*/
		gems.common.troops = data;
		gems.tools.dumpTroops();

	});
}


gems.tools.updateTroopData = function() {
	gems.common.log("loading troop data");

	if ($('#jsonbucket').val() != "") {
		gems.common.log("using cached data.");
		gems.tools.parseTroopList($('#jsonbucket').val());
		return true;
	}

	gems.common.log("whoops!  accidentally hitting their server.");
	return false;

	$.getJSON(gems.tools.proxyUrl + "?url=" + gems.tools.wikiBaseUrl + gems.tools.slug.troopList, function(data) {
		gems.common.log("troop data fetched.  parsing.");
		gems.tools.parseTroopList(data['contents']);
	});

}


gems.tools.parseTroopList = function(htmlString) {

	var htmlDom = $(htmlString);

	$.each( htmlDom.find('img[data-image-key]'), function( key, val ) {
		if ($(val)[0].hasAttribute("alt")) {
			
			if ($(val).attr('alt').lastIndexOf("Troop ", 0) === 0) {
				// we've found a troop!
				var troopName = $(val).parent().attr('title');
				var troopUrl = $(val).parent().attr('href');
				var troopImage = $(val).attr('data-src');
				troopImage = troopImage.substring(0, troopImage.indexOf('.png') + 4);
				var troop = {"name":troopName, "image":troopImage, "url":troopUrl};

				gems.common.troops[troopName] = troop;
				gems.common.log("troop added: " + troopName);

			}
		}
	});

	$.each(gems.common.troops, function(troopName, troopData) {
		gems.common.log("fetching troop data: " + troopName + " from " + gems.tools.proxyUrl + "?url=" + gems.tools.wikiBaseUrl + troopData['url']);
		gems.tools.parseList.push(troopName);

		$.getJSON(gems.tools.proxyUrl + "?url=" + gems.tools.wikiBaseUrl + troopData['url'], function(data) {
			gems.common.log(troopName + " fetched.  parsing.");
			gems.tools.parseTroopData(troopName, data['contents']);
		});

	});

	gems.tools.checkFinishedParsingTroops();

}


// data i care about in the list:
// 	name, kingdom, color, cost, type, rarity
// data i care about in the detail:
//	name, image, progression table, color, cost, type, rarity, kingdom, spell name, spell desc, spell image, quote
// keyword index field:
//	name, kingdom, color, cost, type, rarity, spell name, spell desc

gems.tools.parseTroopData = function(troopName, htmlString) {
	var htmlDom = $(htmlString);

	var basicTroop = htmlDom.find('aside');
	gems.common.troops[troopName]['flavor'] = basicTroop.find('i').text();
	gems.common.log(troopName + " flavor: " + gems.common.troops[troopName]['flavor']);

	$.each( basicTroop.find('.pi-data-label'), function( i, typeNode ) {
		if ($(typeNode).text() == "Rarity") {
			gems.common.troops[troopName]['rarity'] = $(typeNode).parent().find('.pi-data-value').text();
			gems.common.log(troopName + " rarity: " + gems.common.troops[troopName]['rarity']);

		} else if ($(typeNode).text() == "Kingdom") {
			gems.common.troops[troopName]['kingdom'] = $(typeNode).parent().find('.pi-data-value').text();
			gems.common.log(troopName + " kingdom: " + gems.common.troops[troopName]['kingdom']);

		} else if ($(typeNode).text() == "Type") {
			gems.common.troops[troopName]['type'] = $(typeNode).parent().find('.pi-data-value').text();
			gems.common.log(troopName + " type: " + gems.common.troops[troopName]['type']);

		} else if ($(typeNode).text() == "Mana") {
			gems.common.troops[troopName]['mana'] = $(typeNode).parent().find('.pi-data-value').text().split("/");
			gems.common.log(troopName + " mana: " + gems.common.troops[troopName]['mana']);

		}
	});

	gems.tools.removeTroopParse(troopName);
	gems.tools.checkFinishedParsingTroops();
}

