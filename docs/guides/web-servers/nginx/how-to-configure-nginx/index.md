---
slug: how-to-configure-nginx
description: 'Understand NGINX configuration for HTTP, Server blocks, Location blocks, Reverse proxy, and Load balancers with configuration examples.'
og_description: 'NGINX is a high-performance web server that delivers large amounts of static content quickly. This tutorial will outline the basic NGINX parameters and conventions.'
keywords: ["nginx", "web server", "configuration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-servers/nginx/how-to-configure-nginx/','/websites/nginx/how-to-configure-nginx/','/web-servers/nginx/configuration/basic/','/websites/nginx/how-to-configure-nginx/index.cfm/','/websites/nginx/basic-nginx-configuration/index.cfm/','/websites/nginx/basic-nginx-configuration/']
modified: 2018-12-18
modified_by:
  name: Linode
published: 2010-01-18
title: Complete Guide to NGINX Configuration
title_meta: How to Configure NGINX
tags: ["web server","nginx"]
authors: ["Linode"]
---

![Introduction to NGINX](how_to_configure_nginx.png "Introduction to NGINX")

[NGINX](https://www.nginx.com/) is a lightweight, high-performance web server designed for high-traffic use cases. The most common use cases are HTTP cache at scale, load balancing, and reverse proxy.

What makes NGINX stand apart is its capability to serve static content such as HTML and Media files effectively. It uses an event-driven model to provide predictable performance even when the load is high.

This guide shows you several different NGINX server configurations.

## NGINX Config: Directives, Blocks, and Contexts

The location of all NGINX configuration files is in the `/etc/nginx/` directory. The primary NGINX configuration file is `/etc/nginx/nginx.conf`.

To set NGINX configurations, use:
  1. [directives](http://nginx.org/en/docs/dirindex.html) - they are NGINX configuration options. They tell NGINX to process actions or know a certain variable, such as where to log errors.
  2. Blocks (also known as contexts) - Groups in which Directives are organized

Note that any character after `#` in a line becomes a comment. And NGINX does not interpret it.

To better understand directives and blocks, take a look at the condensed copy of `/etc/nginx/nginx` conf below:

{{< file "/etc/nginx/nginx.conf" >}}
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
       . . .
}

http {
       . . .
}

{{< /file >}}


There are 4 directives provided in this snippet in the main context :
  1. `user`
  2. `worker_processes`
  3. `error_log`
  4. `pid`

Additional directives can be placed inside of events{...}, http{...} and so on. To read more about directives, visit the [official NGINX documentation](https://nginx.org/en/docs/ngx_core_module.html).

Let’s take a look at these blocks and their NGINX configurations.

## NGINX Configuration - http Block

http blocks contain directives to help manage web traffic. These directives are often universal as they are passed on to all website configurations NGINX serves. A list of available directives for http blocks are available on official NGINX http block documentation.

{{< file "/etc/nginx/nginx.conf" nginx >}}
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
{{< /file >}}

In the http block there’s an include directive that tells NGINX where website configuration files are located. The command changes depending upon your source of NGINX installation:

  1. Installation from official NGINX repository: include directive is `include /etc/nginx/conf.d/*.conf;`. Every website you host with NGINX gets it’s own configuration file in `/etc/nginx/conf.d/`, with names formatted as `example.com.conf`.
  2. Installation from Debian or Ubuntu repositories: the include directive here would now be `include /etc/nginx/sites-enabled/*;` With site configuration file stored in `/etc/nginx/sites-available/`

## NGINX Configuration - Server Blocks

Regardless of the installation source, server configuration files contain a server block for a website. Here’s an example server block:

{{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen         80 default_server;
    listen         [::]:80 default_server;
    server_name    example.com www.example.com;
    root           /var/www/example.com;
    index          index.html;
    try_files $uri /index.html;
}

{{</ file >}}

There are several directives in this block that are worth taking a look at:
  1. `listen` - tells NGINX the hostname/IP and the TCP port where it should listen for HTTP connections
  2. `server_name`: allows multiple domains to be served from a single IP address. Ideally, it should be created per domain or site. Based on the request header it receives, the server decides which domain to serve.

### NGINX Server Blocks Configuration

Here are some examples for `server_name` NGINX configuration based on sites you want to host on the server.

Configuration for processing requests for both `example.com` and `www.example.com`:

{{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server_name example.com www.example.com;
{{< /file >}}

NGINX configuration example for processing requests for all subdomains for `example.com`:

{{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server_name *.example.com;
server_name .example.com;
{{< /file >}}

Configuration for processing requests of all domains that start with `example.`:

{{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server_name example.*;
{{< /file >}}

## NGINX Configuration of Location Blocks

`Location` directives cover requests for specific files and folders. It also allows NGINX to respond to requests for resources within the server. Here’s an NGINX location blocks configuration:

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location / { }
location /images/ { }
location /blog/ { }
location /planet/ { }
location /planet/blog/ { }

{{< /file >}}

The locations are literal string matches, which means that a request to `http://example.com/planet/blog/` or `http://example.com/planet/blog/about/` is fulfilled by `location /planet/blog/` , even though `location /planet/`  also matches this request.

## Configuring NGINX location directive using regex match

When a  `location`  directive is followed by a tilde (~), NGINX server performs a regular expression (regex) match. NGINX uses [Perl Compatible Regular Expression (PCRE)](https://perldoc.perl.org/perlre) for regex. Here’s an example:

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location ~ IndexPage\.php$ { }
location ~ ^/BlogPlanet(/|/index\.php)$ { }
{{< /file >}}

If you want this match to be case-insensitive, configure your location directive by adding an asterisk to tilde(~*).

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location ~* \.(pl|cgi|perl|prl)$ { }
location ~* \.(md|mdwn|txt|mkdn)$ { }
{{< /file >}}

Adding a caret and tilde(^!) to location directives tells NGINX if it matches a particular string stop searching for more specific matches. And to use the directives here instead.

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location ^~ /images/IndexPage/ { }
location ^~ /blog/BlogPlanet/ { }

{{< /file >}}

Finally, if you add an equals sign (=), this forces an exact match with the path requested and stops searching for more specific matches.

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location = / { }
{{< /file >}}

### Location Root and Index Configuration

`root` and `index` determine the content of the associated `location` directive block. Here’s an example:

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location / {
    root html;
    index index.html index.htm;
}
{{< /file >}}

In this example, the document root is located in the `html/` directory. Under the default installation prefix for the NGINX, the full path to this location is `/etc/nginx/html/`.

Here’s a complex example that shows a set of `location` directives for a server responding to the domain  `example.com`:

{{< file "/etc/nginx/sites-available/example.com location directive" nginx >}}
location / {
    root   /srv/www/example.com/public_html;
    index  index.html index.htm;
}

location ~ \.pl$ {
    gzip off;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass unix:/var/run/fcgiwrap.socket;
    fastcgi_index index.pl;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
}

{{< /file >}}

In this NGINX configuration, all requests that end in a `.pl` extension are handled by the second location block, which specifies a `fastcgi` handler for these requests. Otherwise, NGINX configuration uses the first location directive.

Let’s analyze how NGINX handles some requests based on this configuration:
  1. `http://example.com/` is requested - if it exists NGINX returns `/srv/www/example.com/public_html/index.html`. If the file doesn’t exist, it serves `/srv/www/example.com/public_html/index.htm`. A 404 is returned if neither exist.
  2. `http://example.com/blog/` is requested - if the file exists, `/srv/www/example.com/public_html/blog/index.html` is returned. If not, `/srv/www/example.com/public_html/blog/index.htm` is served instead. If neither exist, a 404 error is returned.
  3. `http://example.com/tasks.pl` is requested -  NGINX uses FastCGI handler to execute the file at `/srv/www/example.com/public_html/tasks.pl`  and return the result.
  4. `http://example.com/username/roster.pl` is requested - NGINX uses FastCGI handler to execute the file at `/srv/www/example.com/public_html/username/roster.pl` and return the result.

## NGINX Configuration of Reverse Proxy

NGINX reverse proxy acts as an intermediate proxy that takes a client request and passes it to the servers. From load balancing, increased security to higher performance - it is used for a range of use cases.

To get started with configuring a reverse proxy, follow these steps.

1. If not already installed, install NGINX by

        apt update
        apt  install nginx

    This installs NGINX web server.

2. Deactivate your virtual host. To deactivate your virtual host run

        unlink /etc/nginx/sites-enabled/default

3. Change your directory to /sites-available and create a reverse proxy there:

        cd /etc/nginx/sites-available`
        nano reverse-proxy.conf`

4. Configure proxy server to redirect all requests on port 80 to a lightweight http server that listens to port 8000. To do that, write the following Nginx configuration:
    {{< file >}}
    server {
      listen 80;
      listen [::]:80;
      access_log /var/log/nginx/reverse-access.log;
      error_log /var/log/nginx/reverse-error.log;
      location / {
        proxy_pass http://127.0.0.1:8000;
      }
    }
    {{< /file >}}

5. Use the symbolic link and copy configuration from `/etc/nginx/sites-available` to `/etc/nginx/sites-enabled`:

        ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/reverse-proxy.conf

6. Verify if NGINX is working:

        nginx -t

If you see a successful test message, NGINX reverse proxy is properly configured on your system.

## Configuring Load Balance with NGINX

We assume that you already have NGINX installed. If not, follow the steps from the previous section. To configure your NGINX and use it as a load balancer, add your backend servers to your configuration file first. Collect your server IPs that acts as load balancers:

{{< file "load_balancer.conf" >}}
upstream backend {
  server 72.229.28.185;
  server 72.229.28.186;
  server 72.229.28.187;
  server 72.229.28.188;
  server 72.229.28.189;
  server 72.229.28.190;
}
{{< /file >}}

After upstream servers are defined, go to the location `/etc/nginx/sites-available/` and edit `load_balancer.conf`.

{{< file "/etc/nginx/sites-available/load_balancer.conf" >}}
upstream backend {
  server 72.229.28.185;
  server 72.229.28.186;
  server 72.229.28.187;
  server 72.229.28.188;
  server 72.229.28.189;
  server 72.229.28.190;
}
server {
  listen 80;
  server_name SUBDOMAIN.DOMAIN.TLD;
  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass https://backend;
           }
}
{{< /file >}}

Every time a request is made to port 80 to SUBDOMAIN.DOMAIN.LTD, request is routed to upstream servers.

After done, execute this new configuration by reloading NGINX using

    nginx -t
    cd /etc/nginx/site-enabled/
    ln -s ../sites-available/load_balancer.conf
    systemctl reload nginx


You can further configure and optimize your load balancer by load balancing methods like Round Robin, Least connected, IP hash, and Weighted.
