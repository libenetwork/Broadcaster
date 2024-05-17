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
const youtube = require('./youtube.js');
const https = require('https');
const WebSocketServer = require('ws').Server;
const url = require('url');
//import { HfInference } from "npm:@huggingface/inference"

const http = require('http');

const app = express();
const server = http.createServer(app).listen(3000, () => {
  console.log('Listening...');
});

app.use(bodyParser.json());

youtube.makeauth();
//console.log("OATH2client generated");

const Socketserver = new WebSocketServer({
server:server
});




app.use((req, res, next) => {
  //console.log('HTTP Request: ' + req.method + ' ' + req.originalUrl);
  return next();
});

app.use(express.static(__dirname + '/www'));


Socketserver.on('connection', (ws, req) => {
  //console.log(req.url);
  if (req.url.includes("webhook")){
    makewebhookserver();
  }else if (req.url.includes("rtmp")){
    makevideoserver();
  }
  else if (req.url.includes("refresh")){
    ws.send(youtube.maketokenrefresh(req.url.split("refresh/")[1]));
  }
  else if(req.url.includes("youtube")){
      if (req.url.split("/youtube/")[1] === "auth"){
          //console.log(youtube.get_autorizationURL());
        makeyoutubeserver();
     
      }
  }
  else{
    ws.terminate(); // No match, reject the connection.
    return;
  }

function  makeyoutubeserver(){

    ws.send(youtube.get_autorizationURL());
    ws.on("message", (msg) =>{
        //console.log(msg.toString());
        try{
        youtube.get_token(msg.toString(), ws);
      }
        catch (e){
            console.log(e);
        }

    });
}


  function makevideoserver() {
    //const Urls = JSON.parse(req.url.split("/rtmp/")[1]);
    try{
    let rtmps = JSON.parse(decodeURI(req.url).slice(6,decodeURI(req.url).length));
    console.log(rtmps);
    let response = ['-i', '-'];
    rtmps.forEach((url) => {
       response = response.concat(['-c:v',  'libx264','-crf','15','-c:a','aac', '-strict','-2','-ar', '44100', '-b:a','64k',
   '-y',    '-use_wallclock_as_timestamps','1','-async', '1',  '-f',  'flv', url]);
    });
    console.log(response);
    const ffmpeg = child_process.spawn('ffmpeg',response);
   ffmpeg.on('close', (code, signal) => {
      console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
      ws.send('FFmpeg child process closed, code ' + code + ', signal ' + signal);
      ws.terminate();
    });
  
    ffmpeg.stdin.on('error', (e) => {
      console.log('FFmpeg STDIN Error', e);
    });

    // FFmpeg outputs all of its messages to STDERR.  Let's log them to the console.
    ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString());
      if (data.toString().includes("fps")) ws.send(data.toString());
    });

    // When data comes in from the WebSocket, write it to FFmpeg's STDIN.
    ws.on('message', (msg) => {

      console.log('DATA', msg);
      ffmpeg.stdin.write(msg);
    });

    // If the client disconnects, stop FFmpeg.
    ws.on("close", (e) => {
      ffmpeg.kill();

    })
  }catch{

  }
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

