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
const http = require('http');

const app = express();
const server = http.createServer(app).listen(3000, () => {
  console.log('Listening...');
});
app.use(bodyParser.json());



const PORT = 3010;

app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});

const videosever = new WebSocketServer({
  server: server
});
const connection_PORT = 8080;
console.log("Waiting connection from:" + connection_PORT);
const webhookserver = new WebSocketServer({ port: connection_PORT });




app.use((req, res, next) => {
  console.log('HTTP Request: ' + req.method + ' ' + req.originalUrl);
  return next();
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

videosever.on('connection', (ws, req) => {
  
  // Ensure that the URL starts with '/rtmp/', and extract the target RTMP URL.
  let match;
  if ( !(match = req.url.match(/^\/rtmp\/(.*)$/)) ) {
    ws.terminate(); // No match, reject the connection.
    return;
  }

  
  const rtmpUrl = decodeURIComponent(match[1]);
  console.log('Target RTMP URL:', rtmpUrl);
  
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
    rtmpUrl 
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
  ws.on('close', (e) => {
    ffmpeg.kill('SIGINT');
  });
  
});
