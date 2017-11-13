---
author:
  name: Linode
  email: docs@linode.com
description: 'Create an SSL Certificate on a Linux Server Running Debian or Ubuntu'
keywords: ["ssl certificate", "ssl cert", "self signed", "debian", "ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssl-certificates/self-signed/']
modified: 2016-08-16
modified_by:
  name: Nick Brewer
published: 2009-11-16
title: 'Create a Self-Signed Certificate on Debian and Ubuntu'
external_resources:
 - '[OpenSSL documentation](http://openssl.org/docs/)'
---

This guide details the process for creating a self-signed SSL certificate on Debian or Ubuntu. Self-signed certificates are suitable for personal use or for applications used internally within an organization.

If you intend to use your SSL certificate on a website powered by Apache, continue to our [SSL Certificates with Apache on Debian & Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu) guide once you've completed the process outlined here.

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

-  Complete our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

-  Ensure that your packages are up to date by running `apt-get update && apt-get upgrade`.

## Create a Self-Signed Certificate

Issue the following command to generate your self-signed certificate. Change `example.com` to reflect the fully qualified domain name (FQDN) of the site you intend to use with SSL:

    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/ssl/certs/example.com.crt -keyout /etc/ssl/private/example.com.key

This command creates a `.crt` file under the `/etc/ssl/certs` directory, and a `.key` file under `/etc/ssl/private` using these options:

*  `-nodes` instructs OpenSSL to create a certificate that does not require a passphrase. If this option is excluded, you will be required to enter the passphrase in the console each time the application using it is restarted.

*  `-days` determines the length of time in days that the certificate is being issued for. For a self-signed certificate, this value can be increased as necessary.

*  `-sha256` ensures that the certificate request is generated using 265-bit SHA (Secure Hash Algorithm).

*  `-x509` tells OpenSSL to create a self-signed certificate.

You will be prompted to add identifying information for your website or organization. After the command completes, you will have a new `.crt` certificate file under `/etc/ssl/certs`, and a private `.key` file under `/etc/ssl/private`.

Restrict the private key and certificate file properties to be read only by owner:

    chmod 400 /etc/ssl/certs/example.com.crt
    chmod 400 /etc/ssl/private/example.com.key
