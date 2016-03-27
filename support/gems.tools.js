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
gems.tools.wikiBaseUrl = "http://gems-of-war.wikia.com/wiki/"

gems.tools.slug = {};
gems.tools.slug.troopList = "Troops";
gems.tools.slug.kingdomList = "Kingdoms";
gems.tools.slug.traitList = "Traits";

gems.tools.init = function() {
	gems.common.log("tools script loaded.");

	$('#grabtroops').click(function() {
		gems.tools.updateTroopData();
	});
	
}


gems.tools.dumpTroops = function() {
	gems.common.log("dumping troop data.");
	var troopData = JSON.stringify(gems.common.troops, null, 2);
	$('#jsonbucket').val(troopData);
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

	//gems.tools.parseTroopData($('#jsonbucket').val());

	//return true;


	// data i care about in the list:
	// 	name, kingdom, color, cost, type, rarity
	// data i care about in the detail:
	//	name, image, progression table, color, cost, type, rarity, kingdom, spell name, spell desc, spell image, quote
	// keyword index field:
	//	name, kingdom, color, cost, type, rarity, spell name, spell desc



	$.getJSON(gems.tools.proxyUrl + "?url=" + gems.tools.wikiBaseUrl + gems.tools.slug.troopList, function(data) {
		gems.common.log("troop data fetched.  parsing.");

		gems.tools.parseTroopData(data['contents']);

		//$('#jsonbucket').val(data['contents']);
		//gems.common.troops = data;
		
		//gems.tools.dumpTroops();
	});

}


gems.tools.parseTroopData = function(htmlString) {

	var htmlDom = $(htmlString);

	gems.common.troops = [];

	$.each( htmlDom.find('img[data-image-key]'), function( key, val ) {
		//console.log($(val));

		//gems.common.log('found possible troop');

		if ($(val)[0].hasAttribute("alt")) {
			
			if ($(val).attr('alt').lastIndexOf("Troop ", 0) === 0) {
				// we've found a troop!

				var troop = {"name":$(val).parent().attr('title'), "link":$(val).parent().attr('href')};
				gems.common.troops.push(troop);


			}


			//gems.common.log(key + "|" + $(val).attr('alt'));
		}
		//gems.common.log($(val).attr('src'));
	});

	gems.tools.dumpTroops();

}



