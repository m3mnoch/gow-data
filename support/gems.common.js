/*
 * namespacing support.
 */
jQuery.namespace = function() {
	var a=arguments, o=null, i, j, d;
	for (i=0; i<a.length; i=i+1) {
		d=a[i].split(".");
		o=window;
		for (j=0; j<d.length; j=j+1) {
			o[d[j]]=o[d[j]] || {};
			o=o[d[j]];
		}
	}
	return o;
};

$.namespace('gems.common');

gems.common.loggingEnabled = true;
gems.common.initMs = Date.now();

gems.common.troopDataUrl = "support/gems.troops.json";
gems.common.troops = {};

gems.common.images = {};
gems.common.images.life = "http://vignette3.wikia.nocookie.net/gems-of-war/images/e/e6/Life.png";
gems.common.images.armor = "http://vignette1.wikia.nocookie.net/gems-of-war/images/0/06/Armor.png";
gems.common.images.attack = "http://vignette2.wikia.nocookie.net/gems-of-war/images/0/00/Attack.png";
gems.common.images.magic = "http://vignette2.wikia.nocookie.net/gems-of-war/images/f/f7/Magic.png";

gems.common.init = function() {
	gems.common.initDate = new Date();
	gems.common.log("common script loaded.");
}

gems.common.log = function(logline) {
	if (gems.common.loggingEnabled) {
		var msDiff = Date.now() - gems.common.initMs;
		console.log(logline);
		$('#gemlog').val(function(i, text) {
		    return text + msDiff + ": " + logline + "\n";
		});
	}
}
