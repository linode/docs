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
external_resources:
  - '[Certbot Official Dcomentation](https://certbot.eff.org/docs/)'
---

## What is Certbot?

Certbot is a tool that automates the process of getting a signed certificate via [Let's Encrypt](https://letsencrypt.org/how-it-works/) to use with TLS.

For most operating system and web server configurations, Certbot creates signed certificates, manages the web server to accept secure connections, and can automatically renew certificates it has created. In most cases, Certbot can seamlessly enable HTTPS without causing server downtime.

## Before You Begin

Make sure you have a Fully Qualified Domain Name (FQDN) with a DNS A/AAA record pointing to the domain's Publlic IP address. Consult [Add DNS Records](https://www.linode.com/docs/websites/hosting-a-website/#add-dns-records) for more information.

## Use Certbot on Debian or Ubuntu

1. Install the Certbot and web server-specific packages, then run Certbot. If using Apache, change each instance of `nginx` to `apache` in the following example:

    **Ubuntu**

        sudo apt-get update
        sudo apt-get install software-properties-common
        sudo add-apt-repository ppa:certbot/certbot
        sudo apt-get update
        sudo apt-get install python-certbot-nginx
        sudo certbot --nginx

    **Debian**

        sudo apt install certbot python-certbot-nginx
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

## Use Certbot on CentOS 7

1.  Enable the EPEL repository

        sudo yum install epel-release
        sudo yum update

1.  Install the Certbot and web server-specific packages, then run Certbot. If using Nginx, change each instance of `apache` to `nginx` in the following example:

        sudo yum install python2-certbot-apache
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

## Keys and Certificate Location

Certbot will store all generated keys and issued certificates in the `/etc/letsencrypt/live/$domain` directory, where `$domain` is the name of the domain entered during the Certbot certificate generation step. Certbot recommends pointing your web server configuration to the default directory or creating symlinks. Keys and certificates should not be moved to a different directory.

## Configure Firewall for HTTPS Traffic

If you have a firewall configured on your Linode, you can add a firewall rule to allow incoming and outgoing connections to the https service.

### UFW: Debian / Ubuntu

    sudo ufw allow https

### firewalld: CentOS

    sudo firewall-cmd --zone=public --permanent --add-service=https

## Use Certbot to Renew All Certificates

You can renew all existing certificates that will expire in under 30 days with the following command:

    certbot renew
