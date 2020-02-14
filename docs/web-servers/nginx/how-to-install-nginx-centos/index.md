---
author:
  name: Linode
  email: docs@linode.com
description: 'NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. This guide demonstrates how to install NGINX on CentOS 8.'
og_description: 'NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. This guide demonstrates how to install NGINX on CentOS 8.'
keywords: ["nginx", "load balancing", "centos", "centos 8", "web server", "static content", "install nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-14
modified_by:
  name: Linode
published: 2018-04-16
title: How to Install NGINX on CentOS 8
h1_title: Installing NGINX on CentOS 8
external_resources:
  - '[NGINX Official Installation Docs](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)'
aliases: ['web-servers/nginx/install-nginx-ubuntu/']
---

## What is NGINX?

NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. It was [initially designed](https://www.nginx.com/resources/glossary/nginx/) to solve scaling and concurrency problems with existing web servers. Its event-based, asynchronous architecture has made it one of the most popular and best-performing web servers available.

## Before You Begin

1.  Set up your Linode in the [Getting Started](/docs/getting-started/) and [Securing your Server](/docs/security/securing-your-server/) guides.

1.  If you want a custom domain name for your site, you can set this up using our [DNS Manager](/docs/platform/manager/dns-manager/) guide.

    - Don't forget to update your `/etc/hosts` file with the public IP and your site's fully qualified domain name as explained in the [Update Your System's hosts File](http://localhost:1313/docs/getting-started/#update-your-system-s-hosts-file) section of the Getting Started guide.

1.  Set your system to SELinux permissive mode:

        sudo setenforce 0
        sudo sed -i 's/^SELINUX=.*/SELINUX=permissive/g' /etc/selinux/config

{{< content "limited-user-note-shortguide" >}}

## Install NGINX

Currently, the best way to install NGINX on CentOS 8 is to use the version included in CentOS's repositories:

    sudo yum update
    sudo dnf install @nginx

## Add a Basic Site

1.  Create a new directory for your site.

        sudo mkdir -p /var/www/example.com

1.  This is where you can add your site files. For now, let's just say "hello". Create a new file, `/var/www/example.com/index.html` in the text editor of your choice. Replace `example.com` with your website’s domain name or your Linode’s public IP address.

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

NGINX site-specific configuration files are kept in `/etc/nginx/sites-available` and symlinked into  `/etc/nginx/sites-enabled/`. Generally you will want to create a separate original file in the `sites-available` directory for each domain or subdomain you will be hosting, and then set up a symlink in the `sites-enabled` directory.

1.  Navigate to the directory where you will create the configuration files.

        cd /etc/nginx

1.  Create the directories for your configuration files:

        sudo mkdir sites-available
        sudo mkdir sites-enabled

1.  Create your site's configuration file in the text editor of your choice. Replace `example.com` in the `server_name` directive with your site's domain name or IP address:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
server {
    listen       80  default_server;
    listen [::]:80   default_server;
    server_name      example.com;

    root /var/www/example.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
{{< /file >}}

1.   Set up a new symlink to the `/etc/nginx/sites-enabled/` directory to enable your configuration:

        sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

1.  Update the NGINX config `/etc/nginx/nginx.conf` file by adding an include for the configuration file you just made, a directive for `server_names_hash_bucket_size`, and comment out the entire `server` block:

    {{< file "/etc/nginx/nginx.conf" >}}
...
    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    server_names_hash_bucket_size 64;

# server {
#    listen  80 default_server {
#        ...
#    }
#}
...
{{</ file >}}

1.  Open the firewall for traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload

### Test and Enable NGINX

1.  You can test your NGINX configuration with this command:

        sudo nginx -t

1.  Start the service with the following commands:

        sudo systemctl enable nginx
        sudo systemctl start nginx

1.  Verify that it's running:

        sudo systemctl status nginx

1.  Navigate to your Linode's domain name or IP address in a browser. You should see your simple page displayed.

## Advanced Configuration

For more advanced configuration options, including security and performance optimizations and TLS setup, see our four-part series on NGINX:

- [Part 1: Installation and Basic Setup](/docs/web-servers/nginx/nginx-installation-and-basic-setup/)
- [Part 2: (Slightly More) Advanced Configurations](/docs/web-servers/nginx/slightly-more-advanced-configurations-for-nginx/)
- [Part 3: Enable TLS for HTTPS Connections](/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/)
- [Part 4: TLS Deployment Best Practices](/docs/web-servers/nginx/tls-deployment-best-practices-for-nginx/)
