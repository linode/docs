---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will show you how to install and configure Caddy and run it as a systemd service.'
keywords: ["caddy", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-14
modified: 2017-09-18
modified_by:
  name: Linode
title: 'Install and Configure Caddy on CentOS 7'
contributor:
  name: Konstantin Kuchinin
  link: https://github.com/coocheenin
external_resources:
- '[Caddy Official Site](https://caddyserver.com)'
---


![Install Caddy on CentOS](/docs/assets/caddy/Caddy.jpg)

[Caddy](https://caddyserver.com/) is a fast, open-source and security-focused web server written in [Go](https://golang.org/). Caddy includes modern features such as support for virtual hosts, minification of static files, and HTTP/2. Caddy is also the first web-server that can obtain and renew SSL/TLS certificates automatically using [Let's Encrypt](https://letsencrypt.org/).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services.

3.  If you want to set up your site for HTTPS using Let's Encrypt, you will need to register your site's domain name and follow our [DNS Manager Overview](/docs/networking/dns/dns-manager-overview#add-records) guide to point your domain to your Linode.

4.  Update your system:

        sudo yum update

## Install Caddy

1.  Enable the [EPEL](https://fedoraproject.org/wiki/EPEL) repository:

        sudo yum install epel-release

2.  Install Caddy:

        sudo yum install caddy

## Add Web Content

1.  Set up a home directory, **web root**, for your website:

        sudo mkdir -p /var/www/my-website
        sudo chown www-data:www-data /var/www
        sudo chmod 555 /var/www

    {{< caution >}}
The files in your web root directory must belong to the Caddy user (www-data). Otherwise, your regular user as well as the Caddy user, has read permission on all files served, and execute permission on all directories.
{{< /caution >}}

2.  If you plan to deploy your pages via an SFTP client--as an administrative user--other than **www-data** or **root**, set the following permissions. Replace `example_user` with the administrator's username:

        sudo usermod -g www-data example_user
        sudo chown -R example_user:www-data /var/www/
        sudo chmod -R 755 /var/www/my-website
        sudo chmod 755 /var/www

3.  Create a test page:

        echo '<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Hello, World!</h1></body></html>' > /var/www/my-website/index.html


## Configure the Caddyfile

Edit the Caddyfile. Replace `203.0.113.0` with the IP address or FQDN of your Linode:

{{< file "/etc/caddy/conf.d/my-website.conf" caddy >}}
203.0.113.0 {
root /var/www/my-website
tls your-email-here@example.com
}
{{< /file >}}


{{< note >}}
If you are using a Linode without a FQDN, delete the `tls your-email-here@example.com` line from the sample Caddyfile above.
{{< /note >}}

## Enable the Caddy Service

1.  Enable the Caddy service:

        sudo systemctl enable caddy.service
        sudo systemctl start caddy.service
        sudo systemctl status caddy.service

2.  The `status` command above will show you the url where Caddy is listening (e.g., `https://203.0.113.0`). Type this url into a browser window, on your local machine and you should see the test page rendered in the browser. If you are using a FQDN and the SSL Certificate integration was successful, you will also see a green lock symbol in the URL bar, indicating that your connection is secure.
