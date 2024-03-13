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
//import { HfInference } from "npm:@huggingface/inference"

const http = require('http');

const app = express();
const server = http.createServer(app).listen(3000, () => {
  console.log('Listening...');
});

app.use(bodyParser.json());


const Socketserver = new WebSocketServer({
server:server
});




app.use((req, res, next) => {
  //console.log('HTTP Request: ' + req.method + ' ' + req.originalUrl);
  return next();
});

app.use(express.static(__dirname + '/www'));


Socketserver.on('connection', (ws, req) => {
  //console.log("acces!");
  // Ensure that the URL starts with '/rtmp/', and extract the target RTMP URL.
  console.log(req.url);
/*  if (!(match = req.url.match(/^\/rtmp\/(.*)$/))) {
    console.log("terminate!");
    ws.terminate(); // No match, reject the connection.
    return;
  }
  if (match === req.url.match(/^\/rtmp\/(.*)$/)) {
    console.log ("Broadcast was started!");
    makevideoserver();
  } else {
    console.log ("Webhook!");
    makewebhookserver();
  }*/
  if (req.url.includes("webhook")){
    makewebhookserver();
  }else if (req.url.includes("rtmp")){
    makevideoserver();
  }else{
    ws.terminate(); // No match, reject the connection.
    return;
  }



  function makevideoserver() {
    const Url = req.url.split("/rtmp/")[1];
   // console.log(Url);
    console.log('Target RTMP URL:', Url);

    // Launch FFmpeg to handle all appropriate transcoding, muxing, and RTMP
    const ffmpeg = child_process.spawn('ffmpeg', [
      // Facebook requires an audio track, so we create a silent one here.
      // Remove this line, as well as `-shortest`, if you send audio from the browser.
      '-f', 'lavfi', '-i', 'anullsrc',

      // FFmpeg will read input video from STDIN
      '-i', '-',

      // Because we're using a generated audio source which never ends,
      // specify that we'll stop at end of other input.  Remove this line if you
      // send audio from the browser.
      '-shortest',

      // If we're encoding H.264 in-browser, we can set the video codec to 'copy'
      // so that we don't waste any CPU and quality with unnecessary transcoding.
      // If the browser doesn't support H.264, set the video codec to 'libx264'
      // or similar to transcode it to H.264 here on the server.
      '-vcodec', 'copy',

      // AAC audio is required for Facebook Live.  No browser currently supports
      // encoding AAC, so we must transcode the audio to AAC here on the server.
      '-acodec', 'aac',

      // FLV is the container format used in conjunction with RTMP
      '-f', 'flv',

      // The output RTMP URL.
      // For debugging, you could set this to a filename like 'test.flv', and play
      // the resulting file with VLC.
      Url
    ]);

    // If FFmpeg stops for any reason, close the WebSocket connection.
   ffmpeg.on('close', (code, signal) => {
      console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
      ws.terminate();
    });

    // Handle STDIN pipe errors by logging to the console.
    // These errors most commonly occur when FFmpeg closes and there is still
    // data to write.  If left unhandled, the server will crash.
    ffmpeg.stdin.on('error', (e) => {
      console.log('FFmpeg STDIN Error', e);
    });

    // FFmpeg outputs all of its messages to STDERR.  Let's log them to the console.
    ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString());
    });

    // When data comes in from the WebSocket, write it to FFmpeg's STDIN.
    ws.on('message', (msg) => {

      console.log('DATA', msg);
      ffmpeg.stdin.write(msg);
    });

    // If the client disconnects, stop FFmpeg.

  }
  function makewebhookserver(){
    const Url = req.url.split("/")[2];
    //console.log(Url);
    console.log('Connected at ' + Url + "!");
    ws.id = Url;
      Socketserver.clients.forEach(function each(client) {
          console.log('Client.ID: ' + client.id);
      });

      app.post('/webhook/' + Url, (req, res) => {
      console.log('Received Webhook from /webhook/' + Url + ':', req.body);
        Socketserver.clients.forEach((client =>
        {
            if ((client.readyState === ws.OPEN) && (client.id === Url)){
                client.send(JSON.stringify(req.body));
                console.log("Sended!");
            }
        }));
      res.status(200).send('OK');

    });

  }

});

