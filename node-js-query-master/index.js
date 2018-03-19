'use strict';

 var http = require('http');
 var WebSocketClient = require('websocket').client;
 var uaa_util = require('predix-uaa-client');
 var express = require('express');
 var url = require('url');
 var path = require('path');
 var request =require('request');
var bodyParser = require('body-parser');
 var httpServer = http.createServer(app);
 var tsUrl = 'wss://gateway-predix-data-services.run.aws-usw02-pr.ice.predix.io/v1/stream/messages';
 var uaaUrl = 'https://ea58027d-5e42-4c74-add2-26d80eee3856.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token';
 var defaultQueryUrlPrefix='https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/';
 var clientId = 'uaa-client';
 var clientSecret = 'twin';
 var app = express();

 global.appRoot = path.join(path.resolve(__dirname), 'server');


 // Set our api routes app.use('/api', api);

 var port = process.env.PORT || 9090;
 app.set('port', port);

 // Parsers for POST data
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));


 app.get('/', (req, res) => {
     res.send({ "Developer" : "Kinshuk"});
  //   console.log(res.send({ "Developer" : "Kinshuk"}));
 });

 //DataQuery
 app.get('/dataquery/tags', function(req,res){
 var queryType = "tags";
 var node = this;

 uaa_util.getToken(uaaUrl, clientId, clientSecret).then((token) => {
     request({
     headers: {
     Authorization: 'Bearer ' + token.access_token,
     'predix-zone-id': '0c8f7d5c-b3b4-46e3-8f05-a0f54eb26a1a',
     //'Origin': 'ws://localhost:9800/websocket',
     'content-type':'application/json'
     },
     uri: defaultQueryUrlPrefix + "tags",
     method: 'GET'
     }, function (err, res, body) {
     console.log(body);

     });
     });
});

app.get('/dataquery/datapoints', function(req,res){
var queryType = "datapoints";
var node = this;
var bod = {
"start": "1y-ago",
"tags": [
{
  "name": "BPU Lifecycle:Sensor03",
  "order": "desc",
  "groups": [
    {
      "name": "quality"
    }
  ]
}
]
}

var hod= JSON.stringify(bod);
console.log(bod);


uaa_util.getToken(uaaUrl, clientId, clientSecret).then((token) => {
    request({
    headers: {
     Authorization: 'Bearer ' + token.access_token,
    'predix-zone-id': '0c8f7d5c-b3b4-46e3-8f05-a0f54eb26a1a',
    //'Origin': 'ws://localhost:9800/websocket',
    'content-type':'application/json',

    },
    body:hod,
    uri: defaultQueryUrlPrefix + "datapoints",
    method: 'POST'
  }, function (err, res, body) {
    console.log(body);
    });
    });
});

 const server = http.createServer(app);
 server.listen(port, () => console.log(`API running on localhost:${port}`));
