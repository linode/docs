---
author:
  name: Linode
  email: docs@linode.com
description: 'Creating an SSL certificate for personal or internal organizational use on a Linux server.'
keywords: 'ssl certificate,ssl cert,self signed ssl,ssl linux,ssl cert linux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['security/ssl-certificates/self-signed/']
modified: Friday, August 16th, 2016
modified_by:
  name: Nick Brewer
published: 'Monday, November 16th, 2009'
title: 'Creating a Self-Signed Certificate on CentOS & Fedora'
external_resources:
 - '[OpenSSL documentation](http://openssl.org/docs/)'
---

This guide details the process for creating a self-signed SSL certificate, suitable for personal use or for applications used internally within an organization. We assume that you've followed the steps outlined in our [Getting Started guide](/docs/getting-started/), and that you're logged into your Linode as the root user. If you intend to use your SSL certificate on a website powered by Apache, you can continue to our [SSL Certificates with Apache on CentOS 7](/docs/security/ssl/ssl-apache2-centos) guide once you've completed the process outlined here.

For an SSL setup with the Nginx web server, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

## Installing OpenSSL

Issue the following command to install required packages for OpenSSL, the open source SSL toolkit.

    yum update
    yum install openssl

## Creating a Self-Signed Certificate

Issue the following command to generate your self-signed certificate, replacing "example.com" with the domain you intend to use with SSL:

    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/pki/tls/certs/example.com.crt -keyout /etc/pki/tls/private/example.com.key

You will be asked to enter values appropriate for your organization and server. The `-days 365` flag in this example will create a certificate valid for 365 days; you may wish to increase this value. We've specified the FQDN (fully qualified domain name) of the Linode for the "Common Name" entry, as this certificate will be used for generic SSL service. The `-nodes` flag instructs OpenSSL to create a certificate that does not require a passphrase. If this option is omitted, you will be required to enter a passphrase on the console to unlock the certificate each time the server application using it is restarted (most frequently, this will happen when you reboot your Linode).

After the command completes, you will have a new `.crt` certificate file under `/etc/pki/tls/certs`, and a private `.key` file under `/etc/pki/tls/private`. You can issue these commands to ensure that both the certificate and the key are properly secured:

    chmod 400 /etc/pki/tls/certs/example.com.crt
    chmod 400 /etc/pki/tls/private/example.com.key

## Next Steps

Once your certificate has been generated, you will need to configure your web server to utilize the new certificate.  Instructions for doing so with several popular platforms can be found at the links below.

- [SSL Certificates with Apache on CentOS 7](/docs/security/ssl/ssl-apache2-centos)
- [SSL Certificates with Nginx](/docs/security/ssl/ssl-certificates-with-nginx)
