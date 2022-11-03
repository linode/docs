---
slug: use-nginx-reverse-proxy
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to use NGINX as a reverse proxy. Understand how headers and buffers can help optimize your application’s performance.'
keywords: ["nginx","reverse proxy","proxy","node.js"]
tags: ["proxy","web server","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-02-02
modified_by:
  name: Linode
published: 2018-03-26
title: Use NGINX as a Reverse Proxy
external_resources:
  - '[NGINX Reverse Proxy – NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)'
aliases: ['/web-servers/nginx/use-nginx-reverse-proxy/']
---

## What is a Reverse Proxy?

A reverse proxy is a server that sits between internal applications and external clients, forwarding client requests to the appropriate server. While many common applications, such as Node.js, are able to function as servers on their own, NGINX has a number of advanced load balancing, security, and acceleration features that most specialized applications lack. Using NGINX as a reverse proxy enables you to add these features to any application.

This guide uses a simple Node.js app to demonstrate how to configure NGINX as a reverse proxy.

## What Are The Benefits Of A Reverse Proxy?
Reverse proxy servers are able to support a number of use-cases. Some of the benefits of using a reverse proxy include:

1. SSL Offloading or inspection
1. Server load balancing
1. Port forwarding
1. Caching
1. L7 filtering and routing

## What Are The Benefits Of Using NGINX As Reverse Proxy?
Some common uses of NGINX as a reverse proxy include load balancing to maximize server capacity and speed, cache commonly requested content, and to act as an additional layer of security.


## Install NGINX

{{< content "install-nginx-ubuntu-ppa" >}}

## Create an Example App

### Install Node.js

Though there are a number of options available to install Node.js, we recommend using NVM with the following steps:

{{< content "how-to-install-nvm" >}}

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

## NGINX Reverse Proxy Configuration Options

With NGINX, there are now standards for serving content over HTTPS. Here are a few recommended NGINX proxy headers and parameters:

| Proxy Header   | Parameter |
| ----------- | ----------- |
| proxy_pass     | http://127.0.0.1:3000       |
| proxy_http_version   | 1.1        |
| proxy_cache_bypass   | $http_upgrade   |
| proxy_set_header Upgrade    | $http_upgrade    |
| proxy_set_header Connection   | "upgrade"   |
| proxy_set_header Host   | $host   |
| proxy_set_header X-Real-IP    | $remote_addr |
| proxy_set_header X-Forwarded-For   | $proxy_add_x_forwarded_for   |
| proxy_set_header X-Forwarded-Proto   | $scheme   |
| proxy_set_header X-Forwarded-Host   | $host   |
| proxy_set_header X-Forwarded-Port   | $server_port   |

The following is an explanation of what each proxy header does:



*   `proxy_http_version`: It is set to HTTP version 1.0 by default, but you can change it to define your HTTP protocol version, e.g. HTTP 1.1 is for WebSockets.
*   `proxy_cache_bypass  $http_upgrade`:   Defines when to bypass your cache when it receives a response.
*   `proxy_set_header`: Upgrade and Connection - are required headers if you are using WebSockets.
*   `proxy_set_header Host $host`: Preferred over proxy_set_header Host $prox_host as you don’t need to explicitly define proxy_host and it’s accounted for by default. $host contains the following: request line hostname or a Host header field hostname.
*   `proxy_set_header X-Real-IP $remote_addr`:  Send the visitors IP address to our proxy server.
*   `proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for`: This is a list of IP addresses of servers that every client was served a proxy from.
*   `proxy_set_header X-Forwarded-Proto $scheme`: Turns HTTP response to an HTTPS response.
*   `proxy_set_header X-Forwarded-Host`: Client’s originally requested host.
*   `proxy_set_header X-Forwarded-Port  $server_port`: Client’s originally requested server port


## Nginx Forward Header For Reverse Proxy

Usually any header for a reverse proxy would look something like this:
{{< file "/etc/nginx/conf.d/nodeapp.conf" conf >}}
X-Forwarded-For: 33.14.57.33, 12.26.13.54

X-Real-IP: 23.67.28.33

X-Forwarded-Host: linode.com

X-Forwarded-Proto: https
{{</ file>}}

Using a `Forward header`, you can update the client address to `X-Forwarded-For` Header. But when you use `X-Forwarded-For`, you have to hard code IP addresses that should be trusted. Which may not be a good solution in some cases.

A better option is to use Forwarded in NGINX.


### Forwarded in NGINX

The way `Fowarded` changes this is by embedding a secret token in the client for identity management. To use a list of hard-coded IP addresses, we would use the `$proxy_add_x_for`, but to use `Forwarded`, we need to create a map object that can enable the usage of Forwarded.

To do so add the following to your NGINX configuration file:

  {{< file "/etc/nginx/conf.d/nodeapp.conf" conf >}}
  map $remote_addr $forwarded_proxy {

      # To send IPv4 addresses

      ~^[0-9.]+$          "for=$remote_addr";

      # Quote and bracket IPv6 addresses

      ~^[0-9A-Fa-f:.]+$   "for=\"[$remote_addr]\"";

      # RFC Syntax, find more information about it here https://tools.ietf.org/html/rfc7239

      default             "for=unknown";

  }

map $http_forwarded $proxy_add_forwarded {

    # Add a condition to check if the header is valid, then update

    "~^(,[ \\t]*)*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*([ \\t]*,([ \\t]*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*)?)*$" "$http_forwarded, $forwarded_proxy";

    # Otherwise, replace it

    default "$forwarded_proxy";

}

{{< /file >}}

Now, make changes to your proxy _pass directive to enable `Forwarded`. Add the following line:

    proxy_set_header Forwarded $forwarded_proxy

**Check for invalid headers**

Our new configuration uses a regex to check and validate all `Forwarded` headers.


## NGINX Reverse Proxy Buffers

When you use an NGINX reverse proxy, you risk degrading your application/server performance as you are adding another layer of complexity to the server between requests. That’s why NGINX’s buffering capabilities are used to reduce the impact of the reverse proxy on performance.

Proxy servers affect performance and impact client to proxy server connections. Based on how performance and user connections are impacted, we can adjust and optimize these connections.

There are buffering directives that can be used to adjust to various buffering behaviors and optimize performance. These buffers are usually set in either location contexts, server, or HTTP. These buffering directives are:
*   `proxy_buffering`: It is enabled by default, and ensures that a response reaches NGINX from the proxy server as soon as possible
*   `proxy_buffer_size`: Determines the size of the buffer for the headers from a backend server.
*   `proxy_busy_buffers_size`: Set the maximum size of your buffers to be in a busy state.
*   `proxy_buffers`: Manages the size and number of buffers. The more buffers you have, the more information you can buffer.
*   `proxy_max_temp_file_size`: This is the maximum size of temporary files on disk allowed per request.
*   `proxy_temp_file_write_size`: Controls amount of data that NGINX will store in temporary files.
*   `proxy_temp_path`: This is the path to temporary file storage for NGINX.



## Configure HTTPS with Certbot

One advantage of a reverse proxy is that it is easy to set up HTTPS using a TLS certificate. [Certbot](https://certbot.eff.org/lets-encrypt/ubuntuxenial-nginx) is a tool that allows you to quickly obtain free certificates from Let's Encrypt. This guide will use Certbot on Ubuntu 16.04, but the official site maintains comprehensive installation and usage instructions for all major distros.

Follow these steps to get a certificate via Certbot. Certbot will automatically update your NGINX configuration files to use the new certificate:

{{< content "certbot-shortguide-ubuntu" >}}

## Next Steps

For more information about general NGINX configuration, see our [NGINX series](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/). For practical examples of NGINX used to reverse proxy applications, see our guides on [RStudio Server](/docs/guides/how-to-deploy-rstudio-server-using-an-nginx-reverse-proxy/) and [Thingsboard](/docs/development/iot/install-thingsboard-iot-dashboard).