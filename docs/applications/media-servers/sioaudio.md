---
author:
    name: Linode Community
    email: docs@linode.com
description: ''
keywords: 'socket.io, audio, nodejs, websockets, express'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
    name: Linode
title: 'Send Binary Data Through Socket.IO'
contributor:
    name: Felix Antimo
    link: github/falvert
---

Socket.IO enables real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.

This guide will introduce you to the basic of Socket.IO, we are going to create a simple application that streams
audio to a web page using socket.io and the Web Audio API. There are many ways to stream audio, this guide is designed for sending binary data through socket.io and encode it with the web audio api.
By the end of this guide, you will be able to send binary data to the browser.

## Installing Prerequisites

1. Before we begin, let's be sure you already have installed NodeJS, if you don't,
you can read the '[Install or Upgrade NodeJS Guide](/docs/websites/nodejs/installing-nodejs)'

2. First, create a directory to hold your application and make it your working directory.

		mkdir audiojs
		cd audiojs

3. In your working directory, create a `package.json` manifest that describes your application.

{: .file }
/chatbox/package.json
:
~~~
{
  "name": "audiojs",
  "version": "0.0.1",
  "description": "audio player",
  "dependencies": {}
}
~~~


3. Now install express in your working directory and socket.io as dependencies

		npm install express --save
		npm install socket.io --save

{: .note}
> Use the `--save` prefix to indicate that you use those libraries as dependences of your project.

## Setting up NodeJS Server

1. Now that all dependencies are installed, create a `server.js` file that will setup our application.

{: .file }
/audiojs/server.js
:
~~~
var app = require('express')();
var http = require('http').Server(app);


// route to home page 
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
	console.log('listening on port *:3000');
});

~~~

What we have just done in this file is the following:

- `app` initialize express as a function.
- `http` create a server to be handled by express.
- We define a route `/` that gets called when someone hit our website.
- Finally we listen to port `3000`.

2. Integrate Socket.IO to `/audiojs/server.js`, edit your file as follow.

{: .file}
/audiojs/server.js
:
~~~
var app = require('express')();
var http = require('http').Server(app);


// socket.io instance
var sio = require('socket.io')(http);

// route to home page 
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// connection event
sio.on('connection', function(socket){
	
});

http.listen(3000, function() {
	console.log('listening on port *:3000');
});
~~~

- We added `var sio = require('socket.io')(http);` that is our socket.io instance at server side.
- Then we listen to the `connection` event for incomming sockets connections.

3. We are going to use `fs` library to open the file as buffer that will be streamed.
Then we add the `audio file` event to send the binary data to the browser.

{: .file}
/audiojs/server.js
:
~~~
var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');

// socket.io instance
var sio = require('socket.io')(http);

// route to home page 
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// connection event
sio.on('connection', function(socket){

	// open file to stream
	fs.readFile(__dirname + '/sample.mp3', function(err, buf){

		// send data to browser
		socket.emit('audio file', {audio: true, audioBuffer: buf} );
	});
	
});

http.listen(3000, function() {
	console.log('listening on port *:3000');
});
~~~

- `sio.emit('audio file', {audio: true, audioBuffer: buf} );` sends the binary data buffer to browser.


## Creating the web interface for your application.

1. Create your index html file at `/audiojs/index.html` as follow.

{: .file}
/audiojs/server.js
:
~~~
<!doctype html>
<html>
  <head>
	<title>AudioJS App</title>
  </head>
  
  <body>
	<h1>Web AudioJS Player</h1>
	

  </body>
</htlm>	
~~~

### Integrating socket.io to client side

1. We are going to add the socket.io library in our client side, edit your `/audiojs/index.html`
and add the following before `</body>`

{: .file-excerpt}
/audiojs/index.html
:
~~~
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
</script>
~~~

2. Add the `audio file` event to your javascript to receive the audio buffer from server.

{: .file-excerpt}
/audiojs/index.html
:
~~~
<script src="/socket.io/socket.io.js"></script>
<script>
	var socket = io();

	socket.on('audio file', function(data){
	});
</script>
~~~

3. Add the `audioContext` to your script, this is part of the web audio api to play the audio
buffer received from the server. 

We are going to receive the audio buffer on the event `audio file`, then the buffer is encoded in the `audioContext`
to play the file. We also added an stop function `function stopPlayer(){ source.stop(0);}` to stop playing the file. 

{: .file-excerpt}
/audiojs/index.html
:
~~~
<script src="/socket.io/socket.io.js"></script>
<script>
	var socket = io();
	var audioContext= new (window.AudioContext || window.webkitAudioContext)();
	var startTime = 0;
	var source;
	
	socket.on('audio file', function(data){
		audioContext.decodeAudioData(data.audioBuffer, function(buffer){
	          source = audioContext.createBufferSource();
	          source.buffer = buffer;
	          source.connect(audioContext.destination);
	          source.start(startTime);
	          
	      });
	});
	function stopPlayer(){ source.stop(0);}
</script>
~~~

4. Add stop button to html.

{: .file-excerpt}
/audiojs/index.html
:
~~~
<body>
<h1>Web AudioJS Player</h1>
<button id="stopButton" onclick="stopPlayer();">Stop</button>
<script src="/socket.io/socket.io.js"></script>
~~~


5. Start your node server to see the results `node server.js`


Now we can send binary data using socket.io library. You can review the source files at '[audiojs-repo](https://github.com/falvert/audiojs)'

	

