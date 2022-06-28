---
slug: how-to-install-nginx-centos-8
author:
  name: Linode
  email: docs@linode.com
description: "Learn the basics of installing and configuring NGINX on your CentOS 8 server in this quick guide."
keywords: ["nginx", "load balancing", "centos", "centos 8", "web server", "static content", "install nginx"]
tags: ["centos","web server","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-14
modified_by:
  name: Linode
published: 2018-04-16
image: L_NGINX_on_CentOS8.png
title: "How to Install NGINX on CentOS 8"
h1_title: "Installing NGINX on CentOS 8"
enable_h1: true
external_resources:
  - '[NGINX Official Installation Docs](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)'
relations:
    platform:
        key: how-to-install-nginx
        keywords:
            - distribution: CentOS 8
aliases: ['/web-servers/nginx/how-to-install-nginx-centos-8/']
---

## What is NGINX?

NGINX is an open source web server with powerful load balancing, reverse proxy, and caching features. It was [initially designed](https://www.nginx.com/resources/glossary/nginx/) to solve scaling and concurrency problems with existing web servers. Its event-based, asynchronous architecture has made it one of the most popular and best-performing web servers available today.

## Before You Begin

1.  Set up your Linode in the [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) and [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide.

1.  If you want a custom domain name for your site, you can set this up using our [DNS Manager](/docs/guides/dns-manager/) guide.

    - Don't forget to update your `/etc/hosts` file with your Linode's public IP address and your site's fully qualified domain name as explained in the [Update Your System's hosts File](/docs/guides/set-up-and-secure/#update-your-systems-hosts-file) section of the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide.

1. Install the SELinux core policy Python utilities. This will give you the ability to manage SELinux settings in a fine-grained way.

        sudo dnf install -y policycoreutils-python-utils

    {{< content "limited-user-note-shortguide" >}}

## Install NGINX

Currently, the best way to install NGINX on CentOS 8 is to use the version included in CentOS's repositories:

    sudo dnf clean all
    sudo dnf update
    sudo dnf install nginx

## Add a Basic Site

1.  Create a new directory for your site. Replace `example.com` with your site's domain name.

        sudo mkdir -p /var/www/example.com

1. Use SELinux's `chcon` command to change the file security context for web content:

        sudo chcon -t httpd_sys_content_t /var/www/example.com -R
        sudo chcon -t httpd_sys_rw_content_t /var/www/example.com -R
        sudo ls -dZ /var/www/example.com

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

1.  Create the directories for your configuration files:

        sudo mkdir -p /etc/nginx/{sites-available,sites-enabled}

1.  Create your site's configuration file in the text editor of your choice. Replace `example.com` in the `server_name` directive with your site's domain name or IP address and `/var/www/example.com` in the `root` directive with your own root directory's location.

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

        sudo firewall-cmd --zone=public --permanent --add-service={http,https}
        sudo firewall-cmd --list-all
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

- For more advanced configuration options, including security and performance optimizations and TLS setup, see our four-part series on NGINX:

  - [Part 1: Installation and Basic Setup](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/)
  - [Part 2: (Slightly More) Advanced Configurations](/docs/guides/getting-started-with-nginx-part-2-advanced-configuration/)
  - [Part 3: Enable TLS for HTTPS Connections](/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/)
  - [Part 4: TLS Deployment Best Practices](/docs/guides/getting-started-with-nginx-part-4-tls-deployment-best-practices/)

- Changes to your NGINX configurations may require updates to your SELinux policies and contexts. For an introduction to SELinux, see our [Getting Started with SELinux](/docs/guides/a-beginners-guide-to-selinux-on-centos-7/) guide.
