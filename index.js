"use strict";
const Alexa = require('alexa-sdk');
const request = require('request');

var EKISPERT_KEY = process.env.EKISPERT_KEY;
var EKISPERT_URL = "https://api.ekispert.jp/v1/json/station/info";
var EKISPERT_URL2 = "https://api.ekispert.jp/v1/json/station";
var DATA = {
  "とうきょうえき": "22828",
  "しんじゅくえき": "22741",
  "こうえんじえき": "22671"
}

exports.handler = function(event, context, callback) {

  console.log(JSON.stringify(event));

  var alexa = Alexa.handler(event, context);

  var stationName = event.request.intent.slots.StarSign.value;
　console.log(stationName);

  var options = {
    uri: EKISPERT_URL2,
    qs: {
      key: EKISPERT_KEY,
      name: stationName
    },
    json: true
   };

   request.get(options, function(error, response, body) {
     if(error) {
       console.log("error");
     } else {
       console.log("success");
       console.log(JSON.stringify(body));
       console.log(body.ResultSet.engineVersion);
       var stationCode = body.ResultSet.Point[0].Station.code;
       var options = {
         uri: EKISPERT_URL,
         qs: {
           key: EKISPERT_KEY,
           code: stationCode,
           type: 'rail'
         },
         json: true
       };
       request.get(options, function(error, response, body) {
         if(error) {
           console.log("error");
         } else {
           console.log("success");
           console.log(body.ResultSet.engineVersion);
           var handlers = {
             'LaunchRequest': function () {
               this.emit('AMAZON.HelpIntent');
             },
             'AMAZON.HelpIntent': function () {
               this.emit(':tell', '駅の乗り入れ路線を検索します');
             },
             'HoroscopeIntent': function () {
               var sign = this.event.request.intent.slots.StarSign.value;
               var railNameList = [];
               var message = "";
               for(var i = 0; i < body.ResultSet.Information.Line.length; i++) {
                 if(body.ResultSet.Information.Line[i].Type == "train") {
                   railNameList.push(body.ResultSet.Information.Line[i].Name);
                 }
               }
               message = sign + 'の乗り入れ路線は' + railNameList.length + '本あります。' + railNameList.join(" ") + "です";

               console.log(message);
               this.emit(':tell', message);
             }
           };
           alexa.registerHandlers(handlers);
           alexa.execute();
         }
       })


     }
   })
};
