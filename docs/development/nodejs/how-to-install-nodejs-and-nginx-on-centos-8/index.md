---
author:
    name: Linode
    email: docs@linode.com
description: 'In this guide you will install and configure NGINX to serve static site content on an CentOS 8 Linode. You will also create a Node.js server and use NGINX as a reverse proxy to your Node.js server. To test your configurations, you will create an index.html file as your static content and a test JavaScript file to be served by your Node.js server. '
og_description: 'In this guide you will install and configure NGINX to serve static site content on an CentOS8 Linode. You will also create a Node.js server and use NGINX as a reverse proxy to your Node.js server. To test your configurations, you will create an index.html file as your static content and a test JavaScript file to be served by your Node.js server.'
keywords: ["linode guide", "hosting a website", "website", "linode setup", " install node.js", " install nginx", "centos", " front-end requests", " back-end requests"]
tags: ["centos", "nginx", "web server", "proxy"]
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
image: 'Installing_Nodejs_and_NGINX_on_CentOS_8_1200x631.png'
---

Node.js is an open-source JavaScript runtime environment that can serve dynamic and responsive content and is often used to create and serve web applications. When serving Node.js applications, NGINX is commonly used to create a reverse proxy that points at a running Node.js server. In this guide, you will install and configure NGINX on a CentOS 8 Linode. NGINX will handle requests to static files, like `index.html` and also, create a reverse proxy to a Node.js server. You will then create a test JavaScript file in order to test your running Node.js server.

## Before You Begin

1.  If you want to use a custom domain name for your site, purchase a domain name from a trusted registrar and use Linode's [DNS Manager](/docs/platform/manager/dns-manager/) to [add the domain](/docs/platform/manager/dns-manager/#add-a-domain) and [create a domain record](/docs/platform/manager/dns-manager/#add-dns-records) for it.

1.  Set up your Linode using the [Getting Started](/docs/getting-started/) and [Securing your Server](/docs/security/securing-your-server/) guides.

    {{< note >}}
Don't forget to update your Linode's `/etc/hosts` file with its public IP address and your site's fully qualified domain name, as explained in the [Update Your System's hosts File](/docs/getting-started/#update-your-system-s-hosts-file) section of the [Getting Started](/docs/getting-started/) guide.
    {{</ note >}}

1. Install the SELinux core policy Python utilities. This will give you the ability to manage SELinux settings in a fine-grained way.

        sudo yum install -y policycoreutils-python-utils

    {{< content "limited-user-note-shortguide" >}}

## Install and Configure NGINX

NGINX site-specific configuration files are kept in `/etc/nginx/sites-available` and symlinked to  `/etc/nginx/sites-enabled/`. Generally, you will create a new file containing a [*server block*](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/) in the `sites-available` directory for each domain or subdomain you will be hosting. Then, you will set up a symlink to your files in the `sites-enabled` directory.

1.  Install NGINX, the command line utilities tmux, and tar.

        sudo dnf update
        sudo dnf install @nginx tmux tar

1.  Start NGINX and enable it to start automatically on reboots.

        sudo systemctl start nginx
        sudo systemctl enable nginx

1.  Create your site's root directory. Replace `example.com` with your site's domain name.

        sudo mkdir -p /var/www/example.com

1.  Use SELinux's `chcon` command to change the file security context for web content.

        sudo chcon -t httpd_sys_content_t /var/www/example.com -R
        sudo chcon -t httpd_sys_rw_content_t /var/www/example.com -R

1.  Create the directories to store your site's NGINX configuration files:

        sudo mkdir -p /etc/nginx/{sites-available,sites-enabled}

1.   Using your preferred text editor, create a new NGINX site configuration file located in the `/etc/nginx/sites-available/` directory. Replace the example file name and any instances of `example.com` with your own domain name or IP address.

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
#Names a server and declares the listening port
server {
    listen 80 default_server;
    server_name example.com www.example.com;

    #Configures the publicly served root directory
    #Configures the index file to be served
    root /var/www/example.com;
    index index.html index.htm;

    #These lines create a bypass for certain pathnames
    #www.example.com/test.js is now routed to port 3000
    #instead of port 80
    location ~* \.(js)$ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}

{{< /file >}}

1.   Create a symlink from your NGINX configuration file in the `sites-available` directory to the `sites-enabled` directory.

        sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

1. Using a text editor, update your NGINX configuration file, `/etc/nginx/nginx.conf`, with the following two changes:

      - Remove the `default_server` parameter from the `listen` directive.

      - Add an `include` directive to the `/etc/nginx/sites-enabled/*` directory. This `include` must be within your configuration file's `http` block. Place the `include` directive below the `include /etc/nginx/conf.d/*.conf;` line.

    {{< file "/etc/nginx/nginx.conf" >}}
...
http {
...
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    server {
        listen       80;
        listen       [::]:80;
    ...
    }
{{</ file >}}

1.  Open your system's firewall for `http` and `https` traffic.

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload

      {{< note >}}
If you plan to use any [httpd](https://en.wikipedia.org/wiki/Httpd) scripts and modules on your server, update the corresponding SELinux Boolean variable. To allow HTTPD scripts and modules to connect to the network, use the following command:

    sudo setsebool -P httpd_can_network_connect on
      {{< /note >}}

{{< content "cloud-firewall-shortguide" >}}

1. Verify that there are no syntax errors in your site's configuration file.

        sudo nginx -t

    Your output should resemble the following:

    {{< output >}}
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
    {{</ output >}}

1.  Restart NGINX to load your site's configuration.

        sudo systemctl restart nginx

## Create Your Site's Index File

{{< note >}}
Ensure you replace `example.com` with your own site's name or IP address in all commands and examples in this section.
{{</ note >}}

1.  Using the text editor of your choice, create your site's index file in the root directory using the example below.

    {{< file "/var/www/example.com/index.html" >}}
<!DOCTYPE html>
<html>
<body>

<p><strong>If you have not finished the <a href="https://linode.com//docs/development/nodejs/how-to-install-nodejs-and-nginx-on-centos-8/">guide</a>, the button below will not work.</strong></p>

<p>The button links to test.js. The test.js request is passed through NGINX and then handled by the Node.js server.</p>

<a href="test.js">
<button type="button">Go to test.js</button>
</a>

</body>
</html>
    {{< /file >}}

## Create Your Node.js Web Server

### Install Node.js

1.  Install the [Node Version Manager](https://github.com/nvm-sh/nvm) (NVM) for Node.js. This program helps you manage different Node.js versions on a single system.

        sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash


1.  To start using `nvm` in the same terminal run the following commands:

        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    Verify that you have access to NVM by printing its current version.

        nvm --version

    You should see a similar output:

    {{< output >}}
0.35.3
    {{</ output >}}

1.  Install Node.js:

    {{< note >}}
As of writing this guide, the latest LTS version of [Node.js](https://nodejs.org/en/download/) is `v12.16.2`. Update this command with the version of Node.js you would like to install.
    {{</ note >}}

        nvm install 12.16.2

1. Use NVM to run your preferred version of Node.js.

        nvm use 12.16.2

    Your output will resemble the following

    {{< output >}}
Now using node v12.16.2 (npm v6.14.4)
    {{</ output >}}

### Create a Test JavaScript File

In the [Install and Configure NGINX](#install-and-configure-nginx) section you configured NGINX to listen on port `80` to serve its static content. You also configured a reverse proxy to your Linode's `localhost:3000` when a request for the `/test.js` file is made. In this section you will create the `test.js` file to be able to test your Node.js web server that you will create in the [next section](#create-your-the-node-js-web-server-file).

{{< note >}}
Ensure you replace `example.com` with your own site's name or IP address in all commands and examples in this section.
{{</ note >}}

1. Create the `test.js` file in your site's root directory.

      {{< file "/var/www/example.com/test.js" >}}
<!DOCTYPE html>
<html>
<body>

<h2>
Your Node.JS server is working.
</h2>

<p>
The below button is technically dynamic. You are now using Javascript on both the client-side and the server-side.</p>

<button type="button" onclick="document.getElementById('sample').innerHTML = Date()"> Display the date and time.</button>
<p id="sample"></p>

</body>
</html>
    {{</ file >}}

### Create the Node.js Web Server File

In this section, you will create a file named `server.js` that will use Node.js modules to help you write a simple web server that can handle client requests and return responses to them.

1. In your site's root directory, create the `server.js` file with the following content.

      {{< file "/var/www/example.com/server.js">}}
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
        {{</ file >}}


1.  Run a new [tmux](/docs/networking/ssh/persistent-terminal-sessions-with-tmux/) session:

        tmux
    Press **return** when prompted.

1. Navigate to your root directory where your `test.js` file is located.

        cd /var/www/example.com

1. Run your Node.js web server. Appending `&` to the end of a command will keep the web server's process running in the background.

        node server.js &

    You should see your terminal return a process ID after issuing the previous command. Return to your command prompt by entering **CTRL+C**.

1.  Exit your tmux session.

        exit

1. Open a browser and navigate to your site's domain or IP address. You should see your site's `index.html` page load.

1. Click on the page's **Go to test.js** button to load the `test.js` page whose content will be served dynamically with your Node.js web server.

1. Click on the test page's **Display the date and time** button to dynamically display the current date and time.

You have now completed the basic configurations to proxy requests to the Node.js server you wrote. As a next step, you may consider looking into further NGINX configurations to better handle serving [static content](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/#) and dynamic content from a [reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).

There are many frameworks to help you continue to develop web apps using JavaScript. You may consider using [Express.js](https://expressjs.com/), [Ember.js](https://emberjs.com/), or [Vue.js](https://vuejs.org/).

