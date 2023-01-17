---
slug: using-socket-io
author:
  name: Linode Community
  email: docs@linode.com
description: "Socket.IO builds on WebSockets to provide real-time, bidirectional communications. And Socket.IO brings in improvements in usage and consistency that make it stand out as a WebSocket alternative. Read this tutorial to find out how Socket.IO sets itself apart and how you can start using it."
keywords: ['what is socket.io','socket.io vs websocket','socket.io node']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-01-13
modified_by:
  name: Nathaniel Stickman
title: "How to Use WebSockets with Socket.IO"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Socket.IO: Get Started](https://socket.io/get-started/chat)'
- '[Tutorials Point: Socket.IO Tutorial](https://www.tutorialspoint.com/socket.io/index.htm)'
- '[Okta Developer: Create a Secure Chat Application with Socket.IO and React](https://developer.okta.com/blog/2021/07/14/socket-io-react-tutorial)'
---

Socket.IO provides real-time, bidirectional communications. It is similar to traditional WebSockets. But with Socket.IO, you have added efficiencies and guarantees, making Socket.IO a compelling choice.

Learn more about what makes Socket.IO stand apart and how you can start building an application with it.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Socket.IO?

[Socket.IO](https://socket.IO/) is a library for low-latency real-time bidirectional communications, similar to what you may be familiar with from WebSockets. But Socket.IO stands out for providing higher-level APIs and a set of guarantees. Thus, Socket.IO aims to provide a more secure and manageable communication solution.

### Socket.IO vs WebSocket

Socket.IO shares the field of real-time bidirectional communications with WebSockets. And, in fact, Socket.IO builds on the WebSocket protocol for many of its communications. What makes Socket.IO a better choice then?

While Socket.IO builds on WebSockets for some of its communications, it is important to note that it is not a WebSockets implementation. Socket.IO actually utilizes a combination of WebSockets and HTTP long-polling to provide more consistent communications and better experience.

Essentially it works like this:

- Socket.IO starts with an HTTP long-polling connection. For when WebSockets do not work for whatever reason, starting with long-polling dramatically improves user experience.

- Socket.IO upgrades the connection to a WebSocket connection when possible from there, as WebSockets provide much more efficient real-time communications.

Beyond that, Socket.IO provides a set of higher-level APIs over WebSockets. This often makes Socket.IO easier to work with, and Socket.IO includes its own set of guarantees about the consistency of communications.

When would you want to use WebSockets directly then? Socket.IO gives a higher-level interface, but for some use cases that is not what you want. In fact, some use cases specifically call for lower-level control over connections and communications. Such cases likely do better working directly with WebSockets.

You can learn more about WebSockets in our tutorial [Introduction to WebSockets](/docs/guides/introduction-to-websockets/).

## How to Use Socket.IO

To start using Socket.IO, you need some application to implement it in. This tutorial helps you set up a basic application for that purpose, to demonstrate Socket.IO's communications.

The example application built in this tutorial consists of a chat application. A typical example for real-time communications, precisely because it clearly and simply shows off those communications. But the example here expands on that, showing how you can readily integrate an AI chatbot into such an application.

Follow along to implement your own Socket.IO server and client and see how it handles.

### Setting Up a Server

This tutorial's example application needs a Socket.IO server and also a server to host the static files for the chat client. One of the most approachable solutions is using the Node.js package for Socket.IO alongside Express JS for hosting the static files.

More options exist for Socket.IO, however, including a Python implementation, [python-socketio](https://github.com/miguelgrinberg/python-socketio). The general approach taken here should be similar regardless of the Socket.IO server implementation you want to use.

Should you want to learn more about Express JS, you can reference our [Express JS Tutorial](/docs/guides/express-js-tutorial/). The present tutorial uses a simpler setup, but the Express JS tutorial can give you more ideas of Express's capabilities.

1. Install the Node Package Manager, NPM. Follow the relevant section of our guide on [How to Install and Use the Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/#how-to-install-npm).

1. Create a directory for your project, giving it the name you would like for your project. This tutorial uses the name `socket-example`. The client-side code gets added to a subdirectory in the next section.

    Once you have created the project directory, change into it as the working directory.

    ```command
    cd ~/
    mkdir socket-example
    cd socket-example
    ```

1. Initialize an NPM project in the directory. This allows you to install Node.js packages, including Express JS and Socket.IO itself.

    ```command
    npm init
    ```

    You can simply follow through the prompts with the <kbd>Enter</kbd> key to select the default options.

1. Install the Express JS package along with the Socket.IO package.

    ```command
    npm install --save express socket.IO
    ```

### Developing the Server

Now your project needs some server-side code implementing Socket.IO. The main part of this is a kind of chat "hub" to receiving new messages from clients and broadcast those messages across all connected sockets. This example does not persist messages, but this is where you would implement persistence if you wanted it.

Additionally, this example application needs to integrate with a chatbot. So the chat server needs to pass inbound messages to a chatbot interface, receive any responses from the chatbot, and broadcast those responses.

The chatbot interface is implemented in a dedicated module, which you can build in the next section.

So, to start, create an `index.js` file within the project directory. This file houses the code for running the chat server. Give the file the contents shown here to that effect. Follow along with the comments in the code here to see what each part does.

```file {title="index.js"}
// Define a PORT variable for the server
const PORT = 3000;

// Import the Express package and initialize the app object
const express = require('express');
const app = express();

// Initialize a basic HTTP server to be used by Socket.IO
const http = require('http');
const server = http.createServer(app);

// Create a Socket.IO server with the HTTP server
const { Server } = require('socket.IO');
const io = new Server(server);

// Import the custom chatbot module
const chatbot = require('./chatbot');

// Serve static files from the public/ directory
app.use(express.static('public'));

// Have Socket.IO listen for socket connections
io.on('connection', (socket) => {
    console.log('Connection made');

    // Define handling for new messages
    socket.on('newmessage', async (messageObject) => {
        console.log('Message received:\n\t' + messageObject.body);

        // Broadcast the message to all sockets
        io.emit('newmessage', messageObject);

        // Fetch a response from the chatbot, and broadcast that response
        botResponse = await chatbot.getResponse({ sender: messageObject.user, message: messageObject.body })
            .then((responses) => {
                for (response of responses) {
                    console.log('Bot message of:\n\t' + response);

                    io.emit('botmessage', { user: 'ChatFriend', body: response });
                }
            })
    });

    // Define handling for disconnects
    socket.on('disconnect', () => {
        console.log('Disconnected user');
    });
});

// Start up the HTTP server on the given port
server.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
```

This relatively simple server handles all of the chat needs. Some features could be added for production use — like user authentication, message persistence, and chat "rooms" — but the bases are covered here.

By abstracting the interface with a chatbot to a separate module, the chat application itself becomes more readily adaptable. This model makes it easier to, say, change the chatbot solution you are using.

### Implementing a Chatbot

There are many ways and options for implementing a chatbot. The server above has left its integration with the chatbot open-ended. It just calls to a `getResponse` function in a `chatbot` module and expects some text response back.

This section covers setting up a basic `chatbot` module that can work with the server created above. That basic module can then be modified to integrate with specific chatbot solutions. Further on in this section you can see some of those solutions, particularly open-source ones, highlighted to give you an idea.

Create a `chatbot.js` file within your project directory, alongside your server file. Then give the file the contents shown here. You can follow along with the in-code comments to see what each part does.

```file {title="chatbot.js"}
// Define a getResponse function exported by the module
exports.getResponse = async (chatObject) => {
    // Set up an initial response array; this can also handle multiple responses to one message
    let response = [];

    //
    // BEGIN CHATBOT IMPLEMENTATION
    // Modify the following depending on your desired chatbot implementation
    //

    // Simplest chatbot: A series of conditions with predefined responses

    if (!chatObject.sender || chatObject.sender === '') {
        response = ['Hello!', 'What is your name?'];
        return response
    }

    if (!chatObject.message || chatObject.message === '') {
        response = ['What did you want to ask?']
        return response
    }

    if (chatObject.message.toLowerCase().includes('hello') || chatObject.message.toLowerCase().includes('hi')) {
        response.push('Hello, ' + chatObject.sender + '!')
    }

    if (chatObject.message.includes('?')) {
        response.push('We will be right with you to answer your question.');
    } else {
        response.push('Did you have a question for us today?')
    }

    //
    // END CHATBOT IMPLEMENTATION
    //

    // Return the response array for the chat server to use
    return response;
}
```

The `getResponse` behavior above represents perhaps the simplest kind of chatbot — one that takes a series of specific conditions and renders predefined responses for each.

But for many use cases that kind of chatbot requires a prohibitively extensive list of conditions. Such a set of conditions would be difficult to implement — and even more difficult to maintain.

For that reason, you likely want to replace the implementation above with something that connects to a chatbot AI. Numerous such chatbots exist, and they generally have the advantage of being designed and trained specifically for handling the variability of text communications.

As an example, what follows are a couple of AI projects of note. Both are open source, making them efficient to pick up, and both are regarded as exceptional tools.

- [Rasa](https://github.com/RasaHQ/rasa), an open-source machine-learning framework for conversations. Rasa specializes in contextualized conversations, and its story-based model helps you handle conversations with back-and-forth exchanges.

- [botpress](https://github.com/botpress/botpress), a full developer stack application for building and running conversational AI applications. botpress gives you an easy-to-navigate administrator interface to construct custom chatbots.

To get started, you can see how to set up your own chatbot using Rasa through our guide [Introduction to the Rasa Framework for Automated Chats](/docs/guides/getting-started-with-rasa/).

### Creating a Client

Finally, the Socket.IO server needs a client interface. This tutorial creates a webpage for that purpose, with a simple interface for users to enter a name and a message. Behind the webpage, the client has the necessary client-side JavaScript to connect to the Socket.IO server.

1. Create a `public/` directory within the project directory.

1. Add an `index.html` file into that directory, and give the file the contents shown here. This defines the page structure and gives some elements that the chat content can be inserted into.

    ```file {title="public/index.html"}
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Socket.IO Example App</title>
        <link rel="stylesheet" href="./main.css"
      </head>
      <body>
        <h1>A Chat with Socket.IO</h1>
        <div class="row">
          <div class="column">
            <ul id="messageField">
            </ul>
          </div>
          <div class="column" id="messageForm">
            <span id="errorMessage"></span>
            <form>
              <div class="row justify-center">
                <label for="messageUser">Your name: </label>
                <input type="text" id="messageUser"></input>
              </div>
              <div class="row justify-center">
                <label for="messageBody">Your message: </label>
                <input type="text" id="messageBody"></textarea>
              </div>
              <div class="row justify-center">
                <input type="button" id="send" value="Send" onclick="sendMessage()"/>
              </div>
            </form>
          </div>
        </div>
        <script src="/socket.IO/socket.IO.js"></script>
        <script src="./main.js"></script>
      </body>
    </html>
    ```

1. Add a `main.js` file to the `public/` directory, and give this file the contents below. Here is where the Socket.IO client comes in. Follow along with the comments in the code to see what each part is doing.

    ```file {title="public/main.js"}
    // Create a socket from the Socket.IO module
    var socket = io();

    // Assign variables for elements of the page for easy access
    var messageUser = document.getElementById('messageUser');
    var messageBody = document.getElementById('messageBody');
    var errorMessage = document.getElementById('errorMessage');
    var messageField = document.getElementById('messageField');

    // Define a function to handle inbound 'newmessage' communications on the
    // socket; render an <li> element for each
    socket.on('newmessage', (messageObject) => {
        var messageElement = document.createElement('li');
        messageElement.innerHTML = "<strong>" + messageObject.user + ":</strong> " + messageObject.body;

        messageField.appendChild(messageElement);
    });

    // Define a function to handle inbound 'botmessage' communications; render
    // these similarly, but with an additional class for visual distinction
    socket.on('botmessage', (messageObject) => {
        var messageElement = document.createElement('li');
        messageElement.classList.add('botMessage');
        messageElement.innerHTML = "<strong>" + messageObject.user + ":</strong> " + messageObject.body;

        messageField.appendChild(messageElement);
    });

    // Define a function for sending a message; this function gets called
    // when the user presses the 'Send' button
    const sendMessage = () => {
        if (messageUser.value != '' && messageBody.value != '') {
            errorMessage.innerHTML = '';

            socket.emit('newmessage', { user: messageUser.value, body: messageBody.value });

            messageBody.value = '';
        } else {
            errorMessage.innerHTML = 'Please complete the form to send a message';
        }
    }
    ```

1. Add a `main.css` file to the `public/` directory to handle the page styling. You can give the file the contents shown here.

    ```file {title="public/main.css"}
    h1 {
        text-align: center;
    }

    .row {
        display: flex;
        padding: 1em;
    }

    .column {
        flex: 50%;
    }

    .justify-center {
        justify-content: center;
    }

    #messageForm {
        text-align: center;
    }

    #errorMessage {
        color: red;
    }

    #messageField {
        list-style-type: none;
    }

    #messageField > li {
        padding: 1em;
    }

    #messageField > li:nth-child(odd) {
        background: #EFEFEF;
    }

    #messageField > li.botMessage {
        background: #AACCFF;
    }
    ```

### Running the Example Application

With everything in place, you can go ahead and run the project to test the Socket.IO connections. Run the command below from within the project directory, and your server should start running on `localhost:3000`.

```command
node index.js
```

Navigate to `localhost:3000` in a web browser to see the application. To access the application remotely, you can use an SSH tunnel.

- On **Windows**, you can use the PuTTY tool to set up your SSH tunnel. Follow the PuTTY section of our guide on how to [Create an SSH Tunnel for MySQL Remote Access](/docs/guides/create-an-ssh-tunnel-for-mysql-remote-access/#how-to-access-mysql-remotely-by-creating-an-ssh-tunnel-with-putty). Use `3000` as the **Source port** and `127.0.0.1:3000` as the **Destination**.

- On **macOS** or **Linux**, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the remote server and `192.0.2.0` with the remote server's IP address:

    ```output
    ssh -L3000:localhost:3000 example-user@192.0.2.0
    ```

[![A demonstration of the example Socket.IO application in action](socket-io-example-app_small.png)](socket-io-example-app.png)

## Conclusion

This has covered the basics of setting up WebSockets with Socket.IO, from developing a Socket.IO server to composing a client for it.

And what is shown here just touches what Socket.IO's capabilities. You can learn more through the link to the official documentation below. There you can get a more full idea of the range of features Socket.IO has.

Interested in the idea of integrating a chatbot with a Socket.IO server? Be sure to look over our [Introduction to the Rasa Framework for Automated Chats](/docs/guides/getting-started-with-rasa/) guide discussed further above.
