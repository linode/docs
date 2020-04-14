---
author:
    name: Linode
    email: docs@linode.com
description: 'Install NGINX for static content and Node.js for dynamic requests.'
og_description: 'Install NGINX for static content and Node.js for dynamic requests.'
keywords: ["linode guide", "hosting a website", "website", "linode setup", " install node.js", " install nginx", "centos", " front-end requests", " back-end requests"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-04-14
modified_by:
    name: Linode
published: 2020-04-14
title: 'How to Install Node.js and NGINX on CentOS 8'
h1_title: 'Installing Node.js and NGINX on CentOS 8'
external_resources:
 - '[Node.js](http://nodejs.org)'
 - '[NGINX](http://nginx.com/)'
 - '[NodeSchool](http://nodeschool.io/)'
 - '[Node Version Manager](https://github.com/creationix/nvm)'
 - '[npm](https://www.npmjs.com/)'
audiences: ["intermediate"]
concentrations: ["Web Applications"]
languages: ["javascript"]
---

Node.js is a JavaScript platform which can serve dynamic, responsive content. JavaScript is usually a client-side, browser language like HTML or CSS. However, Node.js is a server-side, JavaScript platform, comparable to PHP. Node.js often works with other popular server applications like NGINX or Apache. In this guide, NGINX is configured to handle front-end, static file requests, and Node.js is configured to handle back-end file requests.

## Before You Begin

1.  Set up your Linode in the [Getting Started](/docs/getting-started/) and [Securing your Server](/docs/security/securing-your-server/) guides.

1.  If you want a custom domain name for your site, you can set this up using our [DNS Manager](/docs/platform/manager/dns-manager/) guide.

    - Don't forget to update your `/etc/hosts` file with your Linode's public IP address and your site's fully qualified domain name as explained in the [Update Your System's hosts File](/docs/getting-started/#update-your-system-s-hosts-file) section of the [Getting Started](/docs/getting-started/) guide.

1. Install the SELinux core policy Python utilities. This will give you the ability to manage SELinux settings in a fine-grained way.

        sudo yum install -y policycoreutils-python-utils

    {{< content "limited-user-note-shortguide" >}}

## Install and Configure NGINX

NGINX site-specific configuration files are kept in `/etc/nginx/sites-available` and symlinked to  `/etc/nginx/sites-enabled/`. Generally, you will create a new file containing a [*server block*](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/) in the `sites-available` directory for each domain or subdomain you will be hosting. Then, you will set up a symlink to your files in the `sites-enabled` directory.

1.  Install NGINX, tmux, and tar:

        sudo yum update
        sudo dnf install @nginx tmux tar

1.  Start NGINX:

        sudo service nginx start

1.  Create a new directory for your site. Replace `example.com` with your site's domain name.

        sudo mkdir -p /var/www/example.com

1.  Use SELinux's `chcon` command to change the file security context for web content:

        sudo chcon -t httpd_sys_content_t /var/www/example.com -R
        sudo chcon -t httpd_sys_rw_content_t /var/www/example.com -R

1.  Create the directories for your configuration files:

        sudo mkdir -p /etc/nginx/{sites-available,sites-enabled}

1.  Change the working directory to the NGINX sites-available directory:

        cd /etc/nginx/sites-available/

1.  Create a new sites-available file, replacing `example.com` with your domain or IP address:

    {{< file "/etc/nginx/sites-available/example.conf" nginx >}}
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

1.   Set up a new symlink to the `/etc/nginx/sites-enabled/` directory to enable your configuration:

        sudo ln -s /etc/nginx/sites-available/example.conf /etc/nginx/sites-enabled/

1.  Change the working directory to the NGINX sites-enabled directory:

        cd /etc/nginx

1. Update the NGINX configuration file, `/etc/nginx/nginx.conf`, to add an `include` directive to the `/etc/nginx/sites-enabled/*` directory. This `include` must be within your configuration files' `http` block. Place the `include` directive below the `include /etc/nginx/conf.d/*.conf;` line.

    {{< file "/etc/nginx/nginx.conf" >}}
...
http {
...
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
...
}
{{</ file >}}

1.  Open the firewall for traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload

      {{< note >}}In addition, if you plan to use any HTTPD scripts on the server, update the corresponding SELinux boolean variable. To allow HTTPD scripts and modules to connect to the network, use `sudo setsebool -P httpd_can_network_connect on` command.{{< /note >}}

1.  Load the new NGINX configuration:

        sudo service nginx reload

## Create the HTML Index File

NGINX is now configured. However, the `example.com` server block points to directories and files that still need to be created.


1.  Change the working directory:

        cd /var/www/example.com

1.  Create the HTML index file:

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

        sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash


2.  To start using `nvm` in the same terminal run the following commands:

        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

3.  Install Node.js:

        nvm install 12.16.2

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


5.  Run a new [tmux](/docs/networking/ssh/persistent-terminal-sessions-with-tmux/) session:

        tmux

6.  Press `return` and run the Node.js server:

        node server.js

7.  To exit the screen, type:

        exit

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


2.  Test the NGINX server at the IP address or domain. Use the "Go to test.js" button to test that the Node.js server is serving files. On the test page, the "Display the date and time" button will execute a client-side snippet of JavaScript to return the current time.

<br>
[Node.js](http://nodejs.org) and [NGINX](http://nginx.com/) are now working together. Route requests to one server or the other depending on your needs. Node.js offers a large [API](http://nodejs.org/api) with many tools. With Node.js, a developer can stay within the JavaScript language while working client-side or server-side.

For next steps, look into technologies like WebSockets, iframes, or framesets. And for developing in JavaScript, try Express.js, Ember.js, jQuery, or the Node Package Manager for modules.
