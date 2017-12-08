---
author:
    name: Joe D.
    email: docs@linode.com
description: 'How to install Nginx for static content and Node.js for dynamic requests.'
keywords: ["linode guide", "hosting a website", "website", "linode setup", " install node.js", " install nginx", " debian", " front-end requests", " back-end requests"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nodejs/how-to-install-nodejs-and-nginx-on-debian/']
modified: 2017-04-11
modified_by:
    name: Linode
published: 2015-01-14
title: 'How to Install Node.js and Nginx on Debian'
aliases: ['websites/nodejs/how-to-install-nodejs-and-nginx-on-debian/','websites/nodejs/nodejs-nginx-debian/','websites/nodejs/how-to-install-nodejs-and-nginx-on-debian/index.cfm/']
external_resources:
 - '[Node.js](http://nodejs.org)'
 - '[NGINX](http://nginx.com/)'
 - '[NodeSchool](http://nodeschool.io/)'
 - '[Node Version Manager](https://github.com/creationix/nvm)'
 - '[npm](https://www.npmjs.com/)'
---

Node.js is a JavaScript platform which can serve dynamic, responsive content. JavaScript is usually a client-side, browser language like HTML or CSS. However, Node.js is a server-side, JavaScript platform, comparable to PHP. Node.js often works with other popular server applications like NGINX or Apache. In this guide, NGINX is configured to handle front-end, static file requests, and Node.js is configured to handle back-end file requests.

## Install and Configure NGINX
This guide can be started immediately after terminal login on a new Linode, it's written for the `root` user. However, before installation you might want to make sure the Linode is up-to-date with our [Getting Started](/docs/getting-started) guide and secured with our [Securing Your Server](/docs/securing-your-server) guide.

1.  Install NGINX as well as screen, which you'll use later:

        apt-get install nginx screen

2.  Start NGINX:

        service nginx start

3.  Change the working directory to the NGINX sites-available directory:

        cd /etc/nginx/sites-available/

4.  Create a new sites-available file, replacing `example.com` with your domain or IP address:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
#Names a server and declares the listening port
server {
    listen 80;
    server_name example.com www.example.com;

    #Configures the publicly served root directory
    #Configures the index file to be served
    root /var/www/example.com;
        index index.html index.htm;

    #These lines create a bypass for certain pathnames
    #www.example.com/test.js is now routed to port 3000
    #instead of port 80
    location /test.js {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}

{{< /file >}}


5.  Change the working directory to the NGINX sites-enabled directory:

        cd /etc/nginx/sites-enabled/

6.  Create a symlink to the new example sites-available file:

        ln -s /etc/nginx/sites-available/example.com

7.  Remove the `default` symlink:

        rm default

8.  Load the new NGINX configuration:

        service nginx reload

## Create the Directories and HTML Index File

NGINX is now configured. However, the `example.com` server block points to directories and files that still need to be created.

1.  Create the `/var/www` and `/var/www/example.com` directories:

        mkdir -p /var/www/example.com

2.  Change the working directory:

        cd /var/www/example.com

3.  Create the HTML index file:

    {{< file "/var/www/example.com/index.html" >}}
<!DOCTYPE html>
<html>
<body>

<br>
<br>

<center>
<p>
<b>
If you have not finished the <a href="https://linode.com/docs/websites/nodejs/nodejs-nginx-debian">guide</a>, the button below will not work.
</b>
</p>
</center>

<center>
<p>
The button links to test.js. The test.js request is passed through NGINX and then handled by the Node.js server.
</p>
</center>

<center>
<a href="test.js">
<button type="button">Go to test.js</button>
</a>
</center>

</body>
</html>

{{< /file >}}



## Install Node.js and Write a Web Server
NGINX is now listening on port 80 and serving content. It's also configured to pass `/test.js` requests to port 3000. The next steps are to install Node.js, then write a server with Node.js. The new server listens on port 3000.

1.  Install the Node Version Manager:

        curl https://raw.githubusercontent.com/creationix/nvm/v0.20.0/install.sh | bash

2.  Close and reopen your terminal.

3.  Install Node.js:

        nvm install 0.10

4.  While still in the `/var/www/example.com` directory, create a Node.js server:

    {{< file "/var/www/example.com/server.js" javascript >}}
//nodejs.org/api for API docs
//Node.js web server
var http = require("http"),                           //Import Node.js modules
    url = require("url"),
    path = require("path"),
    fs = require("fs");

http.createServer(function(request, response) {       //Create server
var name = url.parse(request.url).pathname;           //Parse URL
var filename = path.join(process.cwd(), name);        //Create filename
fs.readFile(filename, "binary", function(err, file) { //Read file
    if(err) {                                         //Tracking Errors
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
    }
    response.writeHead(200);                          //Header request response
    response.write(file, "binary");                   //Sends body response
    response.end();                                   //Signals to server that
 });                                                  //header and body sent
}).listen(3000);                                      //Listening port
console.log("Server is listening on port 3000.")      //Terminal output

{{< /file >}}


5.  Run a new [screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session:

        screen

6.  Press `return` and run the Node.js server:

        node server.js

7.  Exit the screen by pressing `Ctrl+a` then `d`.

## Create the Test.js File
NGINX is listening on port 80 and passing any `/test.js` requests to port 3000. Node.js is listening on port 3000 and serving any file requests. Next, write a `/test.js` file.

1.  Create the file:

    {{< file "/var/www/example.com/test.js" html >}}
<!DOCTYPE html>
<html>
<body>

<center>
<h2>
Your Node.JS server is working.
</h2>
</center>

<center>
<p>
The below button is technically dynamic. You are now using Javascript on both the client-side and the server-side.
</p>
</center>
<br>

<center>
<button type="button"
onclick="document.getElementById('sample').innerHTML = Date()">
Display the date and time.
</button>
<p id="sample"></p>
</center>

</body>
</html>

{{< /file >}}


2.  Test the NGINX server at the IP address or domain. Use the "Go to test.js" button to test that the Node.js server is serving files. On the test page, the "Display the date and time" button will execute a client-side snippet of javascript to return the current time.

<br>
[Node.js](http://nodejs.org) and [NGINX](http://nginx.com/) are now working together. Route requests to one server or the other depending on your needs. Node.js offers a large [API](http://nodejs.org/api) with many tools. With Node.js, a developer can stay within the JavaScript language while working client-side or server-side.

For next steps, look into technologies like WebSockets, iframes, or framesets. And for developing in JavaScript, try Express.js, Ember.js, jQuery, or the Node Package Manager for modules.
