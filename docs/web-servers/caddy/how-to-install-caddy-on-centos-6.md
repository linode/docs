---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will show you how to install and configure Caddy, a modern web server, running as a service. You will also obtain a free SSL-Certificate for a website automatically.'
keywords: 'caddy,centOS,web servers'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Thursday, September 14th, 2017'
modified: Monday, September 18th, 2017
modified_by:
  name: Linode
title: 'How to Install Caddy on CentOS 7'
contributor:
  name: Konstantin Kuchinin
  link: https://github.com/coocheenin
external_resources:
- '[Caddy Official Site](https://caddyserver.com)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*
----

[Caddy](https://caddyserver.com/) is a fast, open-source web server written in Go. Its low memory use and easy configuration have made it an increasingly popular choice. In addition, it offers out-of-the-box security features: it uses HTTPS by default, and it is the first web server that can obtain certificates for you automatically using [Let's Encrypt](https://letsencrypt.org/). It can also automatically renew your certificates in the background.

Caddy also includes modern web server functionality such as support for virtual hosts, minification of static files, and HTTP2. For more information about Caddy's features, please see the details in the [Official Documentation](https://caddyserver.com/docs)

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  If you want to set up your site for HTTPS using Let's Encrypt, you will need to buy a Fully Qualified Domain Name (FQDN) and follow our [DNS Manager Overview]('https://www.linode.com/docs/networking/dns/dns-manager-overview#add-records') guide to set your new domain name to point to your Linode.

4.  Update your system:

        sudo yum update

{:.note}
>
> Throughout this guide, replace `203.0.113.0` with the IP address or FQDN of your Linode.

## Installing

1.  Make sure you have `wget` installed on your system:

            sudo yum install wget

2. Install Caddy. Since Caddy is written entirely in Go and has no dependencies, this step is simple:

            sudo wget -qO- https://getcaddy.com | bash -s http.minify

## Install Caddy

1.  Create an unprivileged user, which will be used for running your Caddy server. This is necessary for security reasons, because running a server as a root or sudo user is bad practice.

        sudo groupadd www-data
        sudo useradd www-data -d /home/www -g www-data -s /sbin/nologin

2.  Create a few necessary directories, for Caddy's config file, log file, and for automatic TLS support:

        sudo mkdir -p /etc/caddy
        sudo touch /etc/caddy/Caddyfile
        sudo mkdir -p /etc/ssl/caddy | sudo mkdir -p /var/log/caddy

 3. Change the owner of these directories and group:

        sudo chown -R www-data:www-data /etc/caddy
        sudo chown -R www-data:root /etc/ssl/caddy
        sudo chown -R www-data:www-data /var/log/caddy

## Configure Caddy as a Service

This section will show you how to allow Caddy to start automatically whenever your system boots.

1.  Download the `caddy.service` file:

        wget https://raw.githubusercontent.com/mholt/caddy/master/dist/init/linux-systemd/caddy.service

2.  Set appropriate permissions for your Caddyfile:

        sudo chown www-data:www-data /etc/caddy/Caddyfile
        sudo chmod 444 /etc/caddy/Caddyfile

3.  Set up a home directory ("web root") for your website:

        sudo mkdir -p /var/www/my-website
        sudo chown www-data:www-data /var/www
        sudo chmod 555 /var/www

{:.caution}
>
>The files in your web root must belong to the Caddy user (www-data) otherwise your regular user as well as Caddy has READ permission on all files to be served and EXECUTE permission on all directories.

4.  If you plan to deploy your pages via SFTP-Client as a regular user, set the following permissions. Replace `regularuser` with your current username:

        sudo usermod -g www-data regularuser
        sudo chown -R regularuser:www-data /var/www/
        sudo chmod -R 755 /var/www/my-website
        sudo chmod 755 /var/www

5.  Create a test page:

        echo '<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Hello, World!</h1></body></html>' > /var/www/my-website/index.html


## Configuring Your Caddyfile

Edit your Caddyfile:

{: .file }
/etc/caddy/Caddyfile
:   ~~~ conf
    203.0.113.0 {
    root /var/www/my-website
    tls your-email-here@example.com
    minify
    }
    ~~~

    {:.note}
    > If you are using a Linode without a FQDN, delete the `tls your-email-here@example.com` line from the sample Caddyfile above.

## Enable the Caddy Service

1.  Install `caddy.service`:

        sudo cp caddy.service /etc/systemd/system/
        sudo chown root:root /etc/systemd/system/caddy.service
        sudo chmod 644 /etc/systemd/system/caddy.service

2.  Restart `systemd` and enable the Caddy service:

        sudo systemctl daemon-reload
        sudo systemctl enable caddy.service
        sudo systemctl start caddy.service
        sudo systemctl status caddy.service

3.  The `status` command above will show you the url at which Caddy is listening (e.g. `https://203.0.113.0`). Type this into a browser window on your local machine and you should see your test page rendered in the browser. If you are using a FQDN and the SSL Certificate integration was successful, you will also see a green lock symbol in the URL bar, indicating that your connection is secure.
