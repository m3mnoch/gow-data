$.namespace('gems.tools');

gems.tools.wikiBaseUrl = "http://gems-of-war.wikia.com/wiki/"

gems.tools.slug = {};
gems.tools.slug.troopList = "Troops";
gems.tools.slug.kingdomList = "Kingdoms";
gems.tools.slug.traitList = "Traits";

gems.tools.init = function() {
	console.log("tools script loaded.");

	$('#grabtroops').click(function() {
		gems.tools.updateTroopData();
	});
	
}


gems.tools.dumpTroops = function() {
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
		gems.common.troops = data;
		gems.tools.dumpTroops();

	});
}



gems.tools.updateTroopData = function() {
	$.ajax({ url: gems.tools.wikiBaseUrl + gems.tools.slug.troopList,
			dataType: 'xml',
			callback: function(returnData) { 
				var mydata = $(returnData).find('noscript');
				$('.after-me').html(mydata);
			}
	});
}



