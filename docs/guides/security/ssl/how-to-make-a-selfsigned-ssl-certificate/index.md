---
slug: how-to-make-a-selfsigned-ssl-certificate
deprecated: true
deprecated_link: 'guides/create-a-self-signed-tls-certificate/'
description: 'Creating an SSL certificate for personal or internal organizational use on a Linux server.'
keywords: ["ssl certificate", "ssl cert", "self signed ssl", "ssl linux", "ssl cert linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-12-02
modified_by:
  name: Linode
published: 2009-11-16
title: 'How to Make a Self-Signed SSL Certificate'
external_resources:
 - '[OpenSSL documentation](http://openssl.org/docs/)'
tags: ["security","ssl"]
authors: ["Linode"]
---

This guide explains the creation of a self-signed SSL certificate, suitable for personal use or for applications used internally in an organization. The end product may be used with SSL-capable software such as web servers, email servers, or other server systems. We assume that you've followed the steps outlined in our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/), and that you're logged into your Linode as root via a shell session.

## Installing OpenSSL

Issue the following command to install required packages for OpenSSL, the open source SSL toolkit.

Debian/Ubuntu users:

    apt-get update
    apt-get upgrade
    apt-get install openssl
    mkdir /etc/ssl/localcerts

CentOS/Fedora users:

    yum install openssl
    mkdir /etc/ssl/localcerts

## Creating a Self-Signed Certificate

As an example, we'll create a certificate that might be used to secure a personal website that's hosted with Apache. Issue the following commands:

    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/ssl/localcerts/example.com.crt -keyout /etc/ssl/localcerts/example.com.key
    chmod 600 /etc/ssl/localcerts/example.com*

Change `example.com` in the above commands to correspond to the domain you are generating the certificate for

You will be asked for several configuration values. Enter values appropriate for your organization and server, as shown here. This example will create a certificate valid for 365 days; you may wish to increase this value. We've specified the FQDN (fully qualified domain name) of the Linode for the "Common Name" entry, as this certificate will be used for generic SSL service. The `-nodes` flag instructs OpenSSL to create a certificate that does not require a passphrase. If this option is omitted, you will be required to enter a passphrase on the console to unlock the certificate each time the server application using it is restarted (most frequently, this will happen when you reboot your Linode).

## Next Steps

Once your certificate has been generated, you will need to configure your web server to utilize the new certificate. Instructions for doing so with several popular platforms can be found at the links below:

- [SSL Certificates with Apache on Debian and Ubuntu](/docs/guides/ssl-apache2-debian-ubuntu/)
- [SSL Certificates with Apache on CentOS 7](/docs/guides/ssl-apache2-centos/)
- [SSL Certificates with Nginx](/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/)
