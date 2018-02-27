"use strict";
const Alexa = require('alexa-sdk');
const rp = require('request-promise');

// Lambda関数のメイン処理
exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context); // Alexa SDKのインスタンス生成
  //alexa.appId = process.env.APP_ID;

  console.log("bb");
  var options = {
    uri: 'https://api.ekispert.jp/v1/json/dataversion',
    qs: {
      key: 'wC4SR9ETBhBcJ3Bv'
    },
    json: true
  };

  rp(options)
    .then(function (body) {
      console.log('User has %d body', body.length);
      console.log(body);
      console.log(body.ResultSet.engineVersion);
    })
    .catch(function (err) {
      // API call failed...
    });
  console.log("aaa");
  alexa.registerHandlers(handlers); // ハンドラの登録
  alexa.execute();                  // インスタンスの実行
};

var handlers = {
  // インテントに紐付かないリクエスト
  'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent'); // AMAZON.HelpIntentの呼び出し
  },
  // スキルの使い方を尋ねるインテント
  'AMAZON.HelpIntent': function () {
    this.emit(':tell', '駅の乗り入れ路線を検索します');
  },
  // 対話モデルで定義した、占いを実行するインテント
  'HoroscopeIntent': function () {
    var options = {
      uri: 'https://api.ekispert.jp/v1/json/dataversion',
      qs: {
        key: 'wC4SR9ETBhBcJ3Bv'
      },
      json: true
    };

    rp(options)
      .then(function (body) {
        console.log('User has %d body', body.length);
        console.log(body);
        console.log(body.ResultSet.engineVersion);
      })
      .catch(function (err) {
        // API call failed...
      });
    var sign = this.event.request.intent.slots.StarSign.value;
    var message = sign + 'の乗り入れ路線は10本あります';
    console.log(message);
    this.emit(':tell', message); // レスポンスの生成
  }
};
