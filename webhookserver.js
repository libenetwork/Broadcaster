/**
 *  Copyright (c) 2017-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

const child_process = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocketServer = require('ws').Server;
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app).listen(3010, () => {
  console.log('Listening...');
});

app.use(bodyParser.json());




const webhookserver = new WebSocketServer({
  server:server
});

app.use(express.static(__dirname + '/www'));

webhookserver.on('connection', (ws, req) => {

  let match;
  if ( !(match = req.url.match(/^\/webhook\/(.*)$/)) ) {
    ws.terminate(); // No match, reject the connection.
    return;
  }

  const webhookUrl = decodeURIComponent(match[1].split("/")[0]);

  console.log('Connected at ' + webhookUrl + "!");

  app.post('/webhook/' + webhookUrl, (req, res) => {
    console.log('Received Webhook from /webhook/' + webhookUrl + ':', req.body);
    ws.send(JSON.stringify(req.body));
    res.status(200).send('OK');
  });

});
