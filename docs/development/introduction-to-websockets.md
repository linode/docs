---
author:
  name: Shivam Mishra
  email: scm.mymail@gmail.com
description: 'This guide will give a brief introduction to WebSocket as well as introduce the reader to WebSocket API along with some examples'
keywords: ["WebSocket", "Sockets", "Intorduction to WebSockets", "What is WebSockets"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-12
modified:
modified_by:
  name: Linode
title: 'An Introduction to WebSockets'
contributor:
  name: Shivam Mishra
  link: https://github.com/scmmishra/ http://twitter.com/scmmishra
external_resources:
  - '[Vanessa Wang. “The Definitive Guide to HTML5 WebSocket.](https://www.apress.com/in/book/9781430247401)'
  - '[RFC 6455 - The WebSocket Protocol](https://tools.ietf.org/html/rfc6455)'
---
# An Introduction to WebSockets
## What is WebSocket
Websocket is a widely supported open standard for developing real time applications. Current solutions are largely based on polling, which is a time synchronous call wherein the client makes a request to the server to see if there is any information available for it. The client receives a response from the server even if there is no information available.

Polling has at least two drawbacks:
1. Polling works for cases where the exact interval of message availability is known, however, in most real-time application, the messages often have limited predictability.
2. It requires the client to open and close many unnecessary connections.

Long polling (also known as Comet) is another popular communication method where the client opens a connection with the server for a set duration. If the server does not have any information, it holds the request open until it has any information for the client, or until it reaches the end of a designated timeout. Essentially, the Comet delays the completion of the HTTP response until the server has something to send to the client, a technique often called a hanging-GET or pending-POST.

The fact that the client has to constantly reconnect to the server for new information makes long polling a bad choice for truly real-time application. The other major issue is, long polling has no standard implementation.

The Connectivity section of the HTML5 specification includes WebSocket. It allows us to create full-duplex, bidirectional connection between a client and a server over the web. It provides a way to create persistent, low latency connection that supports transactions supported by either the client or the server.
Using websockets we can create truly real-time applications like chat, collaborative document editing, stock trading applications, multiplayer online games, etc.

## Before You Begin
Basic understanding of objects in programming, and some basic JavaScript will be enough to understand WebSockets, however, one can just skip the code snippets and still can understand the guide with ease.

## WebSocket API
The WebSocket protocol consists of an opening handshake, followed by a basic message frame, and is layered over TCP.

The handshake from the client looks as follows:

        GET /chat HTTP/1.1
        Host: server.example.com
        Upgrade: websocket
        Connection: Upgrade
        Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
        Origin: http://example.com
        Sec-WebSocket-Protocol: chat, superchat
        Sec-WebSocket-Version: 13

The handshake from the server looks as follows:

        HTTP/1.1 101 Switching Protocols
        Upgrade: websocket
        Connection: Upgrade
        Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
        Sec-WebSocket-Protocol: chat

The websocket API enables your applications to control the WebSocket protocol and respond to events triggered by the server. Since the API is purely event driven, once the full-duplex connection is established, when the server has data to send to the client, or if resources that we care about change their state, it automatically sends the data or notifications. With an event-driven API, we do not need to poll the server for the most updated status of the targeted resource.
## Creating a WebSocket Connection
To connect to a remote server/host, we simply create a new WebSocket object instance and provide the new object with a URL that represents the endpoint to which we wish to connect. A WebSocket connection is established by upgrading from the HTTP protocol to the WebSocket Protocol during the initial handshake between the client and the server, over the same underlying TCP connection. An `Upgrade` header is included in this request that informs the server that the client wishes to establish a WebSocket connection. Once established, WebSocket messages can be sent back and forth between the methods defined by the WebSocket interface.

To get started, we create a connection by calling the WebSocket constructor which returns the object instance. We can listen for events on that object. These events tell us when the connection opens, when messages arrive, when the connection closes, and when errors occur. We can interact with the WebSocket instance to send messages or close the connection.

The WebSocket constructor takes one required argument, URL (the URL to which we want to connect) and one optional argument, protocols that your client can use to communicate with a server. The server in turn selects the protocol to use; only one protocol can be used between a client and a server. These protocols are used over the WebSocket Protocol.

This is how a simple websocket connection looks like
```javascript
// Connecting to the server with one protocol called myProtocol
var ws = new WebSocket("ws://echo.websocket.org", "myProtocol");
```
## WebSocket Events
The asynchronous nature of WebSockets gives us the freedom that as long as a WebSocket connection is open, our application can simply listens for events. To start listening for the events, we simply add callback functions to the WebSocket object or we can use the `addEventListener()` DOM method to add event listeners to our WebSocket objects.

A WebSocket object dispatches four different events:
- **Open**: This event occurs when the server responds to the WebSocket connection request. The callback to the open event is called `onopen`. By the time the event is fired, the handshake is complete. So on receiving an open event, we can be sure that a connection is established
```javascript
// Event handler for the WebSocket connection opening
ws.onopen = function(e) {
   console.log("Connection established");
};
```
- **Message**: This event occurs when client receives data from server. WebSocket messages contain the data from the server. The callback for the message event is `onmessage`
(Note: The WebSocket API only exposes complete messages, not WebSocket frames.)
```javascript
// Event handler for receiving text messages, we assume that we are receiving a string message
ws.onmessage = function(e) {
      console.log("Message received", e, e.data);
};
```
- **Error**: This event occurs when there is any error in communication. The corresponding callback to the error event is called `onerror`. (Note: Errors also cause WebSocket connections to close.)
```javascript
// Event handler for errors in the WebSocket object
ws.onerror = function(e) {
   console.log("WebSocket Error: " , e);
   //Custom function for handling errors
   handleErrors(e);
};
```
- **Close**: This event occurs when the connection is closed. The corresponding callback to the close event is called `onclose`.
```javascript
// Event handler for closed connections
ws.onclose = function(e) {
   console.log("Connection closed", e);
};
```
## WebSocket Methods
Websocket allows two methods:
- **send()**: The `socket.send(data)` method transmits data using the connection. If for some reasons the connection is not available or the connection is closed, it throws an exception about the invalid connection state.
```javascript
// Send a text message
ws.send("Let's learn WebSocket!");
```
- **close()**: The `socket.close()` method would be used to terminate any existing connection. If the connection is already closed, then the method does nothing. After calling `close()`, we cannot send any more data on the closed WebSocket. We can optionally pass two arguments to the `close()` method: code (a numerical status code) and reason (a text string).
```javascript
// Close the WebSocket connection
ws.close(1000, "Closing Connection Normally");
```
## WebSocket Object Attributes
Following are the attribute of WebSocket object.
- **readyState**: readyState is a read-only attribute. It represents the state of the connection. It can have the following values −
    - A value of 0 indicates that the connection is in progress and has not yet been established.
    - A value of 1 indicates that the connection is established and messages can be sent between the client and the server.
    - A value of 2 indicates that the connection is going through the closing handshake.
    - A value of 3 indicates that the connection has been closed or could not be opened.

- **bufferedAmount**: bufferedAmount is also a read-only attribute. It represents the number of bytes of UTF-8 text that have been queued using send() method.
```javascript
// 6400 max buffer size.
var THRESHOLD = 6400;

// Create a New WebSocket connection
var ws = new WebSocket("ws://echo.websocket.org");

// Listen for the opening event
ws.onopen = function () {
   // Attempt to send update every second.
   setInterval( function() {
      // Send only if the buffer is not full
      if (ws.bufferedAmount < THRESHOLD) {
         ws.send(getApplicationState());
      }
   }, 1000);
};
```
- **protocol**: As discussed before, protocol argument lets the server know which protocol the client understands and can use over WebSocket.
```javascript
// Connecting to the server with multiple protocol choices

var ws = new WebSocket("ws://echo.websocket.org", [ "protocol", "another protocol"])

echoSocket.onopen = function(e) {
   // Check the protocol chosen by the server
   console.log( ws.protocol);
}
```
## Putting it all together
```javascript
<!DOCTYPE html>
<title>WebSocket Echo Client</title>
<h2>Websocket Echo Client</h2>

<div id="output"></div>
<script>
    // Initialize WebSocket connection and event handlers
    function setup() {  
        output = document.getElementById("output");  
        ws = new WebSocket("ws://echo.websocket.org/echo");

        // Listen for the connection open event then call the sendMessage function          
        ws.onopen = function (e) {      
            log("Connected");      
            sendMessage("Hello WebSocket!")  
        }

        // Listen for the close connection event
        ws.onclose = function (e) {      
            log("Disconnected: " + e.reason);  
        }

        // Listen for connection errors
        ws.onerror = function (e) {      
            log("Error ");  
        }

        // Listen for new messages arriving at the client
        ws.onmessage = function (e) {      
            log("Message received: " + e.data);
            // Close the socket once one message has arrived.      
            ws.close();  
        }
    }

    // Send a message on the WebSocket.
    function sendMessage(msg) {  
        ws.send(msg);      
        log("Message sent");  
    }

    // Display logging information in the document.
    function log(s) {  
        var p = document.createElement("p");  
        p.style.wordWrap = "break-word";  
        p.textContent = s;  
        output.appendChild(p);

           // Also log information on the javascript console
          
        console.log(s);
    }

    // Start running the example.
    setup();
</script>
```
After running the webpage if you get an output something like this, congratulations! You have created your first websocket client application.

![Expected Output](/docs/assets/introduction-to-websockets-output.png "Expected Output")

## At the server side of the things
Often a reverse proxy such as an HTTP server is used to detect WebSocket handshakes, process them, and send those clients to a real WebSocket server. The upside of this is that you can excuse your server from the clutter of handling cookies and authentication handlers.
A WebSocket server can be built using many libraries across programming languages, some of them are
- Javascript
    - [Socket.io](https://socket.io/)
    - [ws](https://github.com/websockets/ws)
    - [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)
- Ruby
    - [EventMachine](https://github.com/igrigorik/em-websocket)
    - [Faye](https://faye.jcoglan.com/)
- Python
    - [pyWebSocket](https://github.com/google/pywebsocket)
    - [tornado](https://github.com/tornadoweb/tornado)
- C++
    - [uWebSockets](https://github.com/uNetworking/uWebSockets)
- C#
    - [Fleck](https://github.com/statianzo/Fleck)
- Java
    - [Jetty](http://www.eclipse.org/jetty/)
- .NET
    - [SuperWebSocket](http://superwebsocket.codeplex.com/)
- GoLang
    - [Gorilla](https://github.com/gorilla/websocket)

Here is a simple example for a WebSocket server using ws:
```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
```
## More Information
- [RFC 6455 - The WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
- [websocket.org](https://www.websocket.org/)
