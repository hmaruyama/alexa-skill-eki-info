'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');

//=========================================================================================================================================
//TODO: このコメント行より下の項目に注目してください。
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";

var APP_ID = undefined;

var SKILL_NAME = "駅知識";
var HELP_MESSAGE = "駅知識を聞きたい時は「駅知識」と、終わりたい時は「おしまい」と言ってください。どうしますか？";
var HELP_REPROMPT = "どうしますか？";
var STOP_MESSAGE = "さようなら";
var EKISPERT_API = "https://api.ekispert.jp/v1/json/station/info";
var EKISPERT_KEY = "アクセスキー";


var handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        // request.get({
        //   url: EKISPERT_API,
        //   qs: {
        //     key: EKISPERT_KEY,
        //     code: "25077", // 名古屋駅
        //     type: "rail"
        //   }
        // }, function(error, response, body) {
        //   var railList = JSON.parse(body).ResultSet.Information.Line;
          // var speechOutput = "名古屋駅に乗り入れている路線は" + railList.length + "件あります。";
          var speechOutput = "名古屋駅に乗り入れている路線は10件あります。";
          this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
        // })
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
