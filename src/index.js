'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var languageStrings = {    
    "en-US": {
        "translation": {            
            "SKILL_NAME" : "Gun Violence Facts",
            "HELP_MESSAGE" : "Ask me for a fact about gun violence!",
            "HELP_REPROMPT" : "Say: give me a fact",
            "STOP_MESSAGE" : "Goodbye!"
        }
    }    
};

var gunFacts = [
  "On an average day, 93 Americans are killed with guns.",
  "On average there nearly 12,000 gun homicides a year in the United States.",
  "For every one person killed with guns, two more people are injured.",
  "62% of firearm deaths in the United States are suicides.",
  "Seven children and teens are killed with guns in the United States on an average day.",
  "In an average month, 50 women are shot to death by intimate partners in the United States.",
  "America's gun homicide rate is more than 25 times the average of other developed countries.",
  "Background checks have blocked nearly 3 million gun sales to prohibited people.",
  "Black men are 14 times more likely than white men to be shot and killed with guns.",
  "The presence of a gun in a domestic violence situation increases the risk of the women being shot and killed by five times."
];
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
        this.emit('GetFact');
    },
    'GetFactIntent': function () {
        this.emit('GetFact');
    },      
    'GetFact': function () {
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

function outputResult(obj) {
    var message = gunFacts[Math.floor(Math.random()*gunFacts.length)];
    
    obj.emit(':tellWithCard', message, obj.t("SKILL_NAME"), message);
}