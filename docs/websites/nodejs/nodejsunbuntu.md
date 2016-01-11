---
title: Node.js on Ubuntu
author:
  name: Steven Kaspar
  email: me@stevenkaspar.com
description: 'Node.js allows you to setup a server using pure, lovable Javascript. This guide will walk you through setting up your first Node.js server on Ubuntu (14.04).'
keywords: 'node,nodejs,node.js,ubuntu,server,api,apis,javascript'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2016'
modified: Monday, January 11th, 2016
modified_by:
  name: Steven Kaspar
title: 'Node.js on Ubuntu'
contributor:
  name: Steven Kaspar
  link: stevenkaspar.com
  external_resources:
-
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

<h2>Before You Begin</h2>

1.  Understand what Node.js is. Node.js is a server executed using Javascript. Benefits of Node.js...
    * Fast: non-blocking I/O model
    * Simple: most every developer in the world knows and understands Javascript to some extent
    * Supported: [NPM - Node Package Manager](https://www.npmjs.com/) is the largest collection of open source libraries in the world
    * Dynamic: setting up complicated process such as streaming and two way communication is made very simple with libraries
    
2.  Understand what Node.js is not good for
    * CPU intensive apps with little input and output
    * Simple non-dynamic HTML pages
    * [Convincing The Boss](http://nodeguide.com/convincing_the_boss.html) (and maybe yourself)

<h2>Install Node.js</h2>
There are a few ways of installing Node.js on your Ubuntu server. If you run `node --version` from your CLI, you will get a response that node and nodejs-legacy are already loaded packages they just need to be installed.

1.  Install node packages

        curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
    
This will do all of the installing and updating to the system needed to for [Node.js - v5.4.x](https://nodejs.org/en/) and [NPM - Node Package Manager](https://www.npmjs.com/).

At the end of the long stream of processes and links you will see

        ## Run `apt-get install nodejs` (as root) to install Node.js 5.x and npm
    
2.  Follow those instructions
    
        sudo apt-get install nodejs
        ...
        Do you want to continue? [Y/n] y
    
3.  Confirm it worked

        root@servername:/# node -v
        v5.4.0
        root@servername:/# npm -v
        3.3.12
    
Now you have Node.js and NPM installed and ready to rock.

<h2>Setup First Hello World Server</h2>
Here you will create your first server using only a few lines of code.

1.  Navigate to your public web pages area most likely `/var/www/example.com/public_html`

        cd /var/www/example.com/public_html
    
2.  Create your server.js file

        touch server.js

3.  Add the following code to `server.js`

    **File path:** /var/www/example.com/public_html/server.js
    ~~~
    var http = require('http');
    const PORT = 8080;

    var server = http.createServer(function(request, response) {
        console.log('Starting node.js server on port ' + PORT);
        response.writeHead(200);    // write 200 to the header response telling it was a success
        response.end('Hello Http'); // send 'Hello Http' as the response
    });

    server.listen(PORT); // tell the script to listen on port PORT(8080)
    ~~~
    
4.  Start up your server

        node server.js
    
    This command runs the server.js script and it will keep running until you end it with **CTRL+C**.

5.  Test the server. To test that your server is running properly you can either

    1.    open a new CLI and do `curl localhost:8080`

    2.    navigate to http://localhost:8080/

    >If you have a domain name, then you can use that. ie `example.com` and change the `PORT` const to 80
    
    >If you have another server or service setup, such as an apache server, listening on the port you try and listen to, you will get an error.
         









    

