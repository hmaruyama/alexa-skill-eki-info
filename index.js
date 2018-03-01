"use strict";
const Alexa = require('alexa-sdk');
const request = require('request');

var EKISPERT_KEY = process.env.EKISPERT_KEY;
var EKISPERT_URL = "https://api.ekispert.jp/v1/json/";


exports.handler = function(event, context, callback) {

  console.log(JSON.stringify(event));

  var alexa = Alexa.handler(event, context);

  var callStationName = event.request.intent.slots.StarSign.value;

  var options = {
    uri: EKISPERT_URL + "/station",
    qs: {
      key: EKISPERT_KEY,
      name: callStationName
    },
    json: true
   };

   request.get(options, function(error, response, body) {
     if(error) {
       console.log("error");
     } else {
       console.log("success");
       console.log(JSON.stringify(body));
       var stationCode = body.ResultSet.Point[0].Station.code;
       var stationName = body.ResultSet.Point[0].Station.Name;
       var options = {
         uri: EKISPERT_URL + "/station/info",
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
           var handlers = {
             'LaunchRequest': function () {
               this.emit('AMAZON.HelpIntent');
             },
             'AMAZON.HelpIntent': function () {
               this.emit(':tell', '駅の乗り入れ路線を検索します');
             },
             'HoroscopeIntent': function () {
               var railNameList = [];
               var message = "";
               for(var i = 0; i < body.ResultSet.Information.Line.length; i++) {
                 if(body.ResultSet.Information.Line[i].Type == "train") {
                   railNameList.push(body.ResultSet.Information.Line[i].Name);
                 }
               }
               message = stationName + 'の乗り入れ路線は' + railNameList.length + '本あります。' + railNameList.join(" ") + "です";

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
