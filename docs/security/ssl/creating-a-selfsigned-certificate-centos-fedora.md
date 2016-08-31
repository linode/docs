---
author:
  name: Linode
  email: docs@linode.com
description: 'Creating an SSL certificate for personal or internal organizational use on a Linux server.'
keywords: 'ssl certificate,ssl cert,self signed ssl,ssl linux,ssl cert linux,centos ssl,fedora ssl'
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

This guide details the process for creating a self-signed SSL certificate on CentOS or Fedora. Self-signed certificates are suitable for personal use or for applications used internally within an organization.

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

{: .note}
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

 - Complete our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

 - Ensure that your packages are up to date by running `yum upgrade`

## Creating a Self-Signed Certificate

Issue the following command to generate your self-signed certificate. Change `example.com` to reflect the fully qualified domain name (FQDN) or IP of the site you intend to use with SSL:

    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/pki/tls/certs/example.com.crt -keyout /etc/pki/tls/private/example.com.key

This command creates a `.csr` file under the `/etc/pki/tls/certs` directory, and a `.key` file under `/etc/pki/tls/private` using these options:

* `-nodes` instructs OpenSSL to create a certificate that does not require a passphrase. If this option is excluded, you will be required to enter the the passphrase in the console each time the application using it is restarted.

* `-days` determines the length of time in days that the certificate is being issued for. For a self-signed certificate, this value can be increased as necessary.

* `-sha256` ensures that the certificate request is generated using 265-bit SHA (Secure Hash Algorithm).

* `-x509` tells OpenSSL to create a self-signed certificate.

You will be prompted to add identifying information for your website or organization. After the command completes, you will have a new `.crt` certificate file under `/etc/pki/tls/certs`, and a private `.key` file under `/etc/pki/tls/private`. You can issue these commands to ensure that both the certificate and the key are properly secured:

    chmod 400 /etc/pki/tls/certs/example.com.crt
    chmod 400 /etc/pki/tls/private/example.com.key

## Next Steps

Once your certificate has been generated, configure your web server to utilize the new certificate.  Instructions for doing so with several popular platforms can be found at the links below.

- [SSL Certificates with Apache on CentOS 7](/docs/security/ssl/ssl-apache2-centos)
- [SSL Certificates with Nginx](/docs/security/ssl/ssl-certificates-with-nginx)
