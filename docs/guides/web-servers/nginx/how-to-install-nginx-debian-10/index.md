---
slug: how-to-install-nginx-debian-10
description: "Learn the basics of installing and configuring NGINX on your Debian 10 server in this quick guide."
keywords: ["nginx", "load balancing", "debian", "debian 10", "web server", "static content", "install nginx"]
tags: ["web server","debian","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-14
modified_by:
  name: Linode
published: 2018-04-16
image: L_NGINX_on_Debian10.png
title: "Installing NGINX on Debian 10"
title_meta: "How to Install NGINX on Debian 10"
external_resources:
  - '[NGINX Official Installation Docs](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)'
relations:
    platform:
        key: how-to-install-nginx
        keywords:
            - distribution: Debian 10
aliases: ['/web-servers/nginx/how-to-install-nginx-debian-10/']
authors: ["Linode"]
---

## What is NGINX?

NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. It was [initially designed](https://www.nginx.com/resources/glossary/nginx/) to solve scaling and concurrency problems with existing web servers. Its event-based, asynchronous architecture has made it one of the most popular and best-performing web servers available.

## Before You Begin

1.  Set up your Linode in the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) and [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide.

1.  If you want a custom domain name for your site, you can set this up using our [DNS Manager](/docs/products/networking/dns-manager/) guide.

    - Don't forget to update your `/etc/hosts` file with the public IP address and your site's fully qualified domain name as explained in the [Update Your System's hosts File](/docs/products/compute/compute-instances/guides/set-up-and-secure/#update-your-systems-hosts-file) section of the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide.

    {{< content "limited-user-note-shortguide" >}}

## Install NGINX

Currently, the best way to install NGINX on Debian 10 is to use the version included in Debian's repositories:

    sudo apt update
    sudo apt install nginx

## Add a Basic Site

1.  Create a new directory for your site. Replace `example.com` with your site's domain name.

        sudo mkdir /var/www/example.com

1.  You can add your site's files in your `/var/www/example.com` directory. Create an index file with a simple "Hello World" example. Using the text editor of your choice, create a new file, `/var/www/example.com/index.html`. Replace `example.com` with your website’s domain name or your Linode’s public IP address.

    {{< file "/var/www/example.com/index.html" html >}}
<!DOCTYPE html>
<html>
    <head>
        <title>My Basic Website</title>
    </head>
    <body>
        <header>
            <h1>Hello World!</h1>
        </header>
    </body>
</html>
{{</ file >}}

## Configure NGINX

NGINX site-specific configuration files are kept in `/etc/nginx/sites-available` and symlinked to  `/etc/nginx/sites-enabled/`. Generally, you will create a new file containing a [*server block*](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/) in the `sites-available` directory for each domain or subdomain you will be hosting. Then, you will set up a symlink to your files in the `sites-enabled` directory.

1.  Disable the default configuration file by removing the symlink in `/etc/nginx/sites-enabled/`:

        sudo unlink /etc/nginx/sites-enabled/default

1.  Create a configuration file for your site in the text editor of your choice. Replace `example.com` in the `server_name` directive with your site's domain name or IP address:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
server {
    listen 80;
    listen [::]:80;
    server_name  example.com;

    root /var/www/example.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
{{< /file >}}

1.   Set up a new symlink to the `/etc/nginx/sites-enabled/` directory to enable your configuration:

        sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

### Test NGINX

1.  Test your configuration for errors:

        sudo nginx -t

1.  Reload the configuration:

        sudo nginx -s reload

1.  Navigate to your Linode's domain name or IP address in a browser. You should see your simple page displayed.

## Advanced Configuration

For more advanced configuration options, including security and performance optimizations and TLS setup, see our four-part series on NGINX:

- [Part 1: Installation and Basic Setup](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/)
- [Part 2: (Slightly More) Advanced Configurations](/docs/guides/getting-started-with-nginx-part-2-advanced-configuration/)
- [Part 3: Enable TLS for HTTPS Connections](/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/)
- [Part 4: TLS Deployment Best Practices](/docs/guides/getting-started-with-nginx-part-4-tls-deployment-best-practices/)
