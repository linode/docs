---
author:
  name: Edward Angert
  email: docs@linode.com
keywords: ["let's encrypt", "certbot", "ssl", "tls", "https"]
description: "This quick answer shows how to use Certbot to secure your site's traffic via TLS."
og_description: "This quick answer shows how to use Certbot to secure your site's traffic via TLS."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-06-27
modified_by:
  name: Linode
published: 2018-06-27
title: Secure HTTP Traffic with Certbot
---

## What is Certbot?

Certbot is a tool that automates the process of getting a signed certificate via [Let's Encrypt](https://letsencrypt.org/how-it-works/) to use with TLS.

For most operating system and web server configurations, Certbot creates signed certificates, manages the web server to accept secure connections, and can automatically renew certificates it has created. In most cases, Certbot can seamlessly enable HTTPS without causing server downtime.

## Use Certbot on Debian or Ubuntu

1.  Install the Certbot and web server-specific packages, change to the webroot parent directory, then run Certbot. If using Apache, change each instance of `nginx` to `apache` in the following example:

        sudo apt install certbot python-certbot-nginx
        cd /var/www/html/example.com/
        sudo certbot --nginx

1.  Certbot will ask for information about the site. The responses will be saved as part of the certificate:

    {{< output >}}
# sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx

Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: example.com
2: www.example.com
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
{{< /output >}}

## Use Certbot on Red Hat or CentOS 7

1.  Enable the EPEL repository

        sudo yum install epel-release
        sudo yum update

1.  Install the Certbot and web server-specific packages, change to the webroot parent directory, then run Certbot. If using Apache, change each instance of `nginx` to `apache` in the following example:

        sudo yum install python2-certbot-apache
        cd /var/www/html/example.com/
        sudo certbot --apache

1.  Certbot will ask for information about the site. The responses will be saved as part of the certificate:

    {{< output >}}
# sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator apache, Installer apache

Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: example.com
2: www.example.com
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
{{< /output >}}

## Configure Firewall for HTTPS Traffic

### UFW: Debian / Ubuntu

    ufw allow https

### firewalld: Red Hat / CentOS

    sudo firewall-cmd --zone=public --permanent --add-service=https

## Use Certbot to Renew All Certificates

    certbot renew
