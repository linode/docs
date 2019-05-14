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

NGINX site-specific configuration files are kept in `/etc/nginx/sites-available` and symlinked into  `/etc/nginx/sites-enabled/`. Generally you will want to create a separate original file in the `sites-available` directory for each domain or subdomain you will be hosting, and then set up a symlink in the `sites-enabled` directory.

1.  Copy the default configuration file. Replace `example.com` with your website's domain name or your Linode's public IP address.

        sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/example.com

2.  Disable the default configuration file by removing the symlink in `/etc/nginx/sites-enabled/`:

        unlink /etc/nginx/sites-enabled/default

3.  Open your site's configuration file in a text editor. Replace `example.com` in the `server_name` directive with your site's domain name or IP address. If you already have content ready to serve (such as a WordPress installation or static files) replace the path in the `root` directive with the path to your site's content:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
server {
    listen       80;
    server_name  example.com

        root /var/www/example.com;
        index index.html;

        location / {
                try_files $uri $uri/ =404;
      }
}
{{< /file >}}

4.   Set up a new symlink to the `/etc/nginx/sites-enabled/` directory to enable your configuration:

        sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

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
