"use strict";
const Alexa = require('alexa-sdk');
const request = require('request');

var EKISPERT_KEY = process.env.EKISPERT_KEY;
var EKISPERT_URL = "https://api.ekispert.jp/v1/json/";


exports.handler = function(event, context, callback) {

  console.log(JSON.stringify(event));

  var alexa = Alexa.handler(event, context);


  var handlers = {
    'LaunchRequest': function () {
      this.emit(':ask', '駅の乗り入れ路線を検索します。駅を教えてください', '駅を教えてください');
    },
    'AMAZON.HelpIntent': function () {
      this.emit(':tell', '駅の乗り入れ路線を検索します');
    }
  };


  if(!event.request.intent) {

    handlers['HoroscopeIntent'] = function () {
      this.emit(':ask', "駅を教えてください", "聞き取れませんでした。駅を教えてください");
    };
    alexa.registerHandlers(handlers);
    alexa.execute();

  } else {
    var callStationName = event.request.intent.slots.StationName.value;
    if(!callStationName) {
      handlers['HoroscopeIntent'] = function () {
        this.emit(':tell', "駅を教えてください", "聞き取れませんでした。駅を教えてください");
      };
      alexa.registerHandlers(handlers);
      alexa.execute();
    } else {
      var options = {
        uri: EKISPERT_URL + "/station",
        qs: {
          key: EKISPERT_KEY,
          name: callStationName,
          type: "train"
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        if(error) {
          console.log("error");
        } else {
          console.log("success");
          console.log(JSON.stringify(body));
          if(!body.ResultSet.Point) {
            handlers['HoroscopeIntent'] = function () {
              this.emit(':tell', "駅が見つかりませんでした。もう一度教えてください", "聞き取れませんでした。駅を教えてください");
            };
            alexa.registerHandlers(handlers);
            alexa.execute();
          } else {
            var stationCode = Array.isArray(body.ResultSet.Point) ? body.ResultSet.Point[0].Station.code : body.ResultSet.Point.Station.code;
            var stationName = Array.isArray(body.ResultSet.Point) ? body.ResultSet.Point[0].Station.Name : body.ResultSet.Point.Station.Name;
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
                handlers['HoroscopeIntent'] = function () {
                  var railNameList = [];
                  var message = "";
                  for(var i = 0; i < body.ResultSet.Information.Line.length; i++) {
                    if(body.ResultSet.Information.Line[i].Type == "train") {
                      railNameList.push(body.ResultSet.Information.Line[i].Name);
                    }
                  }
                  message = stationName + 'の乗り入れ路線は' + railNameList.length + '本あります。' + railNameList.join(" ") + "です";
                  this.emit(':tell', message);
                };
                alexa.registerHandlers(handlers);
                alexa.execute();
              }
            })
          }
        }
      })
    }
  }
};
