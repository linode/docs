---
author:
  name: Linode
  email: docs@linode.com
description: 'NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. This guide demonstrates how to install NGINX on Ubuntu 18.04.'
og_description: 'NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. This guide demonstrates how to install NGINX on Ubuntu 18.04.'
keywords: ["nginx", "load balancing", "ubuntu", "ubuntu 18", "web server", "static content", "install nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-04-16
modified_by:
  name: Linode
published: 2018-04-16
title: Install NGINX on Ubuntu 18.04
external_resources:
  - '[NGINX Official Installation Docs](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)'
---

![Install NGINX on Ubuntu 18](install-nginx-ubuntu-smg.jpg)

## What is NGINX?

NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. It was [initially designed](https://www.nginx.com/resources/glossary/nginx/) to solve scaling and concurrency problems with existing web servers. Its event-based, asynchronous architecture has made it one of the most popular and best-performing web servers available.

## Install NGINX

Currently, the best way to install NGINX on Ubuntu 18.04 is to use the version included in Ubuntu's repositories:

    sudo apt update
    sudo apt install nginx

## Configure NGINX

### Add Basic Site

NGINX site-specific configuration files are kept in `/etc/nginx/conf.d/`. Generally you will want a separate file in this directory for each domain or subdomain you will be hosting.

1.  Copy the default configuration file. Replace `example.com` with your website's domain name or your Linode's public IP address.

        sudo cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/example.com.conf

2.  Disable the default configuration file by adding `.disabled` to the filename:

        sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled

3.  Open your site's configuration file in a text editor. Replace `example.com` in the `server_name` directive with your site's domain name or IP address. If you already have content ready to serve (such as a WordPress installation or static files) replace the path in the `root` directive with the path to your site's content:

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen       80;
    server_name  example.com;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
{{< /file >}}

### Test NGINX

1.  Test your configuration for errors:

        sudo nginx -t

2.  Reload the configuration:

        sudo nginx -s reload

3.  Navigate to your Linode's domain name or IP address in a browser. You should see the NGINX default page displayed (or your own content, if you specified the path in the previous section).

## Advanced Configuration

For more advanced configuration options, including security and performance optimizations and TLS setup, see our four-part series on NGINX:

- [Part 1: Installation and Basic Setup](/docs/web-servers/nginx/nginx-installation-and-basic-setup/)
- [Part 2: (Slightly More) Advanced Configurations](/docs/web-servers/nginx/slightly-more-advanced-configurations-for-nginx/)
- [Part 3: Enable TLS for HTTPS Connections](/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/)
- [Part 4: TLS Deployment Best Practices](/docs/web-servers/nginx/tls-deployment-best-practices-for-nginx/)
