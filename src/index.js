'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var languageStrings = {    
    "en-US": {
        "translation": {            
            "SKILL_NAME" : "Blue Loop (unofficial)",
            "HELP_MESSAGE" : "Ask me where the blue loop is!",
            "HELP_REPROMPT" : "Ask me where the blue loop is!",
            "STOP_MESSAGE" : "Goodbye!"
        }
    }    
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetBlueLoopLocations');
    },
    'GetBlueLoopLocationsIntent': function () {
        this.emit('GetBlueLoopLocations');
    },      
    'GetBlueLoopLocations': function () {
		outputResult(this);
    },    
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function outputResult(obj, findFunction) {
    request('http://m.psu.edu/shuttleschedule/scripts/vehicle_proxy.php?busid=1', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        output(obj, json);
      }
    });
}

function output(obj, json) {
    var busStops = json.map(function(bus) {
		return bus.LastStop;
	});
	
	var message = "";
	if(busStops.length > 0) {
		message = "The buses are at " + busStops.join(", ");
	} else {
		message = "There are no buses operating right now.";
	}
	    
    obj.emit(':tellWithCard', message, obj.t("SKILL_NAME"), message);
}