---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to install and configure Caddy, a modern web server, running as a service on Cent)S 6.8. You will also obtain a free SSL-Certificate for a website automatically.'
keywords: 'caddy,centOS,servers'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Thursday, September 14th, 2017'
modified: Friday, September 15th, 2017
modified_by:
  name: Linode
title: 'How to Install Caddy on CentOS 6'
contributor:
  name: K. Kuchinin
external_resources:
- '[Caddy Official Site](https://caddyserver.com)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*
----

[Caddy](https://caddyserver.com/) a fast, open-source web server written in Go. Its low memory use and easy configuration have made it an increasingly popular choice. In addition, it offers out-of-the-box security features: it uses HTTPS by default, and it is the first web server that can obtain certificates for you automatically using [Let's Encrypt](https://letsencrypt.org/). It can also automatically renew your certificates in the background.

Caddy also includes modern web server functionality such as support for virtual hosts, minification of static files, and HTTP2. For more information about Caddy's features, please see the details in the [Official Documentation](https://caddyserver.com/docs)

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo yum update

## Installing

1.  Make sure you have `wget` installed on your system:

            sudo yum install wget

2. Install Caddy. Since Caddy is written entirely in Go and has no dependencies, this step is simple:

            sudo wget -qO- https://getcaddy.com | bash -s http.minify


Then we need to make any changes to system environment. It's strange, but `/usr/local/bin` is missing from superuser `$PATH`.
Let's fix this bug:

      echo 'pathmunge /usr/local/bin' | sudo tee /etc/profile.d/localbin.sh
      sudo chmod +x /etc/profile.d/localbin.sh

## Setup

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

 4.  Configure Caddy as a service to run at startup. To do this, download a special CentOS 6 init-script Edition (forked from official init-script):

          sudo wget -P /etc/init.d https://gist.githubusercontent.com/coocheenin/9d6cd2a0f3a148c24c9f2c6649c63643/raw/87f9dcb3def7ec04d728f7544fcaf3a73294b4f1/caddy

 5.  Don't forget to make it executable:

        sudo chmod +x /etc/init.d/caddy

Whats the difference between this script and official script? The key command, which starts Caddy as a daemon, is different.
Since the command `start-stop-daemon` is missing in CentOS, daemonize utility was found in replacement.

Let's install with `yum` utility:

      sudo yum install -y daemonize

Activate Caddy as a service (daemon) to enable it to start on boot:

      sudo chkconfig --add caddy
      sudo chkconfig --level 2345 caddy on

 Done! Now we can check it like `sudo service caddy status`.
 The output will look like this:
 > caddy is not running

## Organizing and Managing Directories to Host a Website

Caddy requires a directory, called the "web root," where the files for your website will be stored.

1. Create a web root directory:

      sudo mkdir /home/www/site1

{:.caution}
>
>The files in your web root must belong to the caddy user (www-data) otherwise your regular user as long as Caddy has READ permission on all files to be served and EXECUTE permission on all directories.

2.  If you plan to deploy your pages via SFTP-Client as regular user, we must set the following permissions. Replace `regularuser` with your current username:

        sudo usermod -g www-data regularuser
        sudo chown -R regularuser:www-data /home/www/site1
        sudo chmod -R 755 /home/www/site1
        sudo chmod 755 /home/www

3.  Create a test page. Since you are now the website's owner, you do not need to use `sudo`:

        echo '<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Hello, World!</h1></body></html>' >> /home/www/site1/index.htm


## Configuring

Edit your Caddyfile:

{: .file }
/etc/caddy/Caddyfile
:   ~~~ conf
    example.com {
    root /home/www/site1
    tls your-email-here@example.com
    minify
    }
    ~~~

## Start the Server

1.  Start the Caddy server:

        sudo service caddy start

2.  Open your browser and type your Linode's IP address with the `https` prefix. You should see your test page rendered in the browser. You should also see the green lock symbol in the URL bar, indicating that you have successfully integrated an SSL-Certificate into your website.
