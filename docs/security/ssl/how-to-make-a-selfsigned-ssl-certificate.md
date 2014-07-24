---
author:
  name: Linode
  email: docs@linode.com
description: 'Creating an SSL certificate for personal or internal organizational use on a Linux server.'
keywords: 'ssl certificate,ssl cert,self signed ssl,ssl linux,ssl cert linux'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['security/ssl-certificates/self-signed/']
modified: Tuesday, June 14th, 2011
modified_by:
  name: Linode
published: 'Monday, November 16th, 2009'
title: 'How to Make a Self-Signed SSL Certificate'
---

This guide explains the creation of a self-signed SSL certificate, suitable for personal use or for applications used internally in an organization. The end product may be used with SSL-capable software such as web servers, email servers, or other server systems. We assume that you've followed the steps outlined in our [getting started guide](/docs/getting-started/), and that you're logged into your Linode as root via a shell session.

Installing OpenSSL
------------------

Issue the following command to install required packages for OpenSSL, the open source SSL toolkit.

Debian/Ubuntu users:

    apt-get update
    apt-get upgrade
    apt-get install openssl
    mkdir /etc/ssl/localcerts

CentOS/Fedora users:

    yum install openssl
    mkdir /etc/ssl/localcerts

Creating a Self-Signed Certificate
----------------------------------

As an example, we'll create a certificate that might be used to secure a personal website that's hosted with Apache. Issue the following commands:

    openssl req -new -x509 -days 365 -nodes -out /etc/ssl/localcerts/apache.pem -keyout /etc/ssl/localcerts/apache.key
    chmod 600 /etc/ssl/localcerts/apache*

You will be asked for several configuration values. Enter values appropriate for your organization and server, as shown here. This example will create a certificate valid for 365 days; you may wish to increase this value. We've specified the FQDN (fully qualified domain name) of the VPS for the "Common Name" entry, as this certificate will be used for generic SSL service. The `-nodes` flag instructs OpenSSL to create a certificate that does not require a passphrase. If this option is omitted, you will be required to enter a passphrase on the console to unlock the certificate each time the server application using it is restarted (most frequently, this will happen when you reboot your Linode).

Once the certificate is generated, you'll need to configure your server software properly to reference the certificate file.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [OpenSSL documentation](http://openssl.org/docs/)



