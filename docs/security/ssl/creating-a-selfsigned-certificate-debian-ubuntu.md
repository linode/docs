---
author:
  name: Linode
  email: docs@linode.com
description: 'Creating an SSL certificate for personal or internal organizational use on a Linux server.'
keywords: 'ssl certificate,ssl cert,self signed ssl,ssl linux,ssl cert linux, debian ssl, ubuntu ssl'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['security/ssl-certificates/self-signed/']
modified: Friday, August 16th, 2016
modified_by:
  name: Nick Brewer
published: 'Monday, November 16th, 2009'
title: 'Creating a Self-Signed Certificate on Debian & Ubuntu'
external_resources:
 - '[OpenSSL documentation](http://openssl.org/docs/)'
---

This guide details the process for creating a self-signed SSL certificate on Debian or Ubuntu. Self-signed certificates are suitable for personal use or for applications used internally within an organization. We assume that you've followed the steps outlined in our [Getting Started guide](/docs/getting-started/), and that you're logged into your Linode as the root user. If you intend to use your SSL certificate on a website powered by Apache, you can continue to our [SSL Certificates with Apache on Debian & Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu) guide once you've completed the process outlined here.

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

## Before You Begin

- Complete our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

- Ensure that your packages are up to date by running `apt-get update && apt-get upgrade`.

## Creating a Self-Signed Certificate

Issue the following command to generate your self-signed certificate, replacing "example.com" with the domain you intend to use with SSL:

    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/ssl/certs/example.com.crt -keyout /etc/ssl/private/example.com.key

This command generates a secure key, as well as a certificate signing request. A brief explanation of the options used:

* `-nodes` instructs OpenSSL to create a certificate that does not require a passphrase. If this option is excluded, you will be required to enter the the passphrase in the console each time the application using it is restarted.

* `-days` determines the length of time in days that the certificate is being issued for. For a self-signed certificate, this value can be increased as necessary.

* `-sha256` ensures that the certificate request is generated using 265-bit SHA (Secure Hash Algorithm).

* `-x509` tells OpenSSL to create a self-signed certificate.

You will be prompted to add identifying information for your website or organization. After the command completes, you will have a new `.crt` certificate file under `/etc/ssl/certs`, and a private `.key` file under `/etc/ssl/private`. You can issue these commands to ensure that both the certificate and the key are properly secured:

    chmod 400 /etc/ssl/certs/example.com.crt
    chmod 400 /etc/ssl/private/example.com.key

## Next Steps

Once your certificate has been generated, you will need to configure your web server to utilize the new certificate.  Instructions for doing so with several popular platforms can be found at the links below.

- [SSL Certificates with Apache on Debian and Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu)
- [SSL Certificates with Nginx](/docs/security/ssl/ssl-certificates-with-nginx)
