---
author:
  name: Linode
  email: docs@linode.com
description: 'NGINX has advanced load-balancing, security, and optimization features that make it an excellent reverse proxy. This guide shows how to configure NGINX using the proxy_pass directive.'
keywords: ["nginx","reverse proxy","proxy","node.js"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-26
modified_by:
  name: Linode
published: 2018-03-26
title: Use NGINX as a Reverse Proxy
external_resources:
  - '[NGINX Reverse Proxy – NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)'
---

## What is a Reverse Proxy?

A reverse proxy is a server that sits between internal applications and external clients, forwarding client requests to the appropriate server. While many common applications, such as Node.js, are able to function as servers on their own, NGINX has a number of advanced load balancing, security, and acceleration features that most specialized applications lack. Using NGINX as a reverse proxy enables you to add these features to any application.

This guide uses a simple Node.js app to demonstrate how to configure NGINX as a reverse proxy.

## Install NGINX

{{< content "install-nginx-ubuntu-ppa" >}}

## Create an Example App

### Install Node.js

{{< content "install-nodejs-nodesource.md" >}}

### Configure the App

1.  Create a directory for the example app:

        mkdir nodeapp && cd nodeapp

2.  Initialize a Node.js app in the directory:

        npm init

    Accept all defaults when prompted.

3.  Install Express.js:

        npm install --save express

4.  Use a text editor to create `app.js` and add the following content:


    {{< file "app.js" js >}}
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Node.js app listening on port 3000.'))
{{< /file >}}

5.  Run the app:

        node app.js

6.  In a separate terminal window, use `curl` to verify that the app is running on `localhost`:

        curl localhost:3000

    {{< output >}}
Hello World!
{{< /output >}}

## Configure NGINX

At this point, you could configure Node.js to serve the example app on your Linode's public IP address, which would expose the app to the internet. Instead, this section configures NGINX to forward all requests from the public IP address to the server already listening on `localhost`.

### Basic Configuration for an NGINX Reverse Proxy

1.  Create a configuration file for the app in `/etc/nginx/conf.d/`. Replace `example.com` in this example with your app's domain or public IP address:

    {{< file "/etc/nginx/conf.d/nodeapp.conf" conf >}}
server {
  listen 80;
  listen [::]:80;

  server_name example.com;

  location / {
      proxy_pass http://localhost:3000/;
  }
}
{{< /file >}}

    The `proxy_pass` directive is what makes this configuration a reverse proxy. It specifies that all requests which match the location block (in this case the root `/` path) should be forwarded to port `3000` on `localhost`, where the Node.js app is running.

2.  Disable or delete the default *Welcome to NGINX* page:

        sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled

3.  Test the configuration:

        sudo nginx -t

4.  If no errors are reported, reload the new configuration:

        sudo nginx -s reload

5.  In a browser, navigate to your Linode's public IP address. You should see the "Hello World!" message displayed.

## Advanced Options

For a simple app, the `proxy_pass` directive is sufficient. However, more complex apps may need additional directives. For example, Node.js is often used for apps that require a lot of real-time interactions. To accommodate, disable NGINX's buffering feature:

  {{< file "/etc/nginx/conf.d/nodeapp.conf" conf >}}
location / {
    proxy_pass http://localhost:3000/;
    proxy_buffering off;
}
{{< /file >}}

You can also modify or add the headers that are forwarded along with the proxied requests with `proxy_set_header`:

{{< file "/etc/nginx/conf.d/nodeapp.conf" conf >}}
location / {
    proxy_pass http://localhost:3000/;
    proxy_set_header X-Real-IP $remote_addr;
}
{{< /file >}}

This configuration uses the built-in `$remote_addr` variable to send the IP address of the original client to the proxy host.

## Configure HTTPS with Certbot

One advantage of a reverse proxy is that it is easy to set up HTTPS using a TLS certificate. [Certbot](https://certbot.eff.org/lets-encrypt/ubuntuxenial-nginx) is a tool that allows you to quickly obtain free certificates from Let's Encrypt. This guide will use Certbot on Ubuntu 16.04, but the official site maintains comprehensive installation and usage instructions for all major distros.

1.  Add the Certbot PPA:

        sudo apt-get update
        sudo apt-get install software-properties-common
        sudo add-apt-repository ppa:certbot/certbot

2.  Update packages and install Certbot:

        sudo apt-get update
        sudo apt-get install python-certbot-nginx

3.  Use the NGINX plugin to generate a certificate:

        sudo certbot --nginx

    Follow the prompts to choose which domains will be covered by the new certificate. You will also be asked to decide whether to redirect HTTP traffic to HTTPS automatically. Regardless of what you choose, Certbot will automatically update your NGINX configuration files to use the new certificate.

## Next Steps

For more information about general NGINX configuration, see our [NGINX series](/docs/web-servers/nginx/nginx-installation-and-basic-setup/). For practical examples of NGINX used to reverse proxy applications, see our guides on [RStudio Server](/docs/development/r/how-to-deploy-rstudio-server-using-an-nginx-reverse-proxy/) and [Thingsboard](/docs/development/iot/install-thingsboard-iot-dashboard).
