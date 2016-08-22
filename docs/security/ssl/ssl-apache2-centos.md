---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve SSL-enabled websites with the HTTPD web server.'
keywords: 'apache SSL,ssl on centos,ssl on fedora,ssl,contos,fedora,apache,httpd'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, August 17th, 2016
modified_by:
  name: Nick Brewer
published: 'Wednesday, November 19th, 2014'
title: 'SSL Certificates with Apache on CentOS 7'
external_resources:
 - '[Apache HTTP Server Version 2.0 Documentation](http://httpd.apache.org/docs/2.0/)'
 - '[Setting up an SSL Secured Webserver with CentOS](http://wiki.centos.org/HowTos/Https)'
---

This guide will assist you with enabling SSL for websites served with the Apache2 web server on CentOS or Fedora, to ensure secure access to your website and services.

## Prerequisites

This guide assumes that you are running Apache2 on CentOS or Fedora. Prior to starting this guide, you will also need to ensure that the following steps have been taken on your Linode:

-   Follow our [Getting Started](/docs/getting-started/) guide to configure your Linode.

-   Follow our [LAMP on CentOS 7](/docs/websites/lamp/lamp-on-centos-7) guide, and create a site that you wish to secure with SSL.

-   Follow our guide for obtaining either a [self signed](docs/security/ssl/creating-a-selfsigned-certificate-centos-fedora) or [commercial](/docs/security/ssl/obtaining-a-commercial-ssl-certificate-centos-fedora.md) SSL certificate.

-   In order to configure your Linode to function with SSL, you will need to ensure that mod_ssl and OpenSSL are installed on your system.  You can do so by running the following command:

        yum install mod_ssl openssl

## Configure Apache to use the SSL Certificate

1.  Edit the virtual host entries in the `/etc/httpd/conf.d/ssl.conf` file to include the certificate files and virtual host information that should be used by each domain. For each virtual host, you will need to replicate the configuration shown below. Replace any mentions of `example.com` with your own domain. If you're using a commercially signed certificate and you've manually downloaded the root CA cert to `/etc/pki/tls/certs`, ensure that the `SSLCACertificateFile` value is configured to point to the root certificate directly. If the root certificate is being provided via the "ca-certificates" bundle, you can simply exclude the `SSLCACertificateFile` line.

    {: .file-excerpt }
    /etc/httpd/conf.d/ssl.conf
    :   ~~~ apache
        <VirtualHost *:443>
             SSLEngine On
             SSLCertificateFile /etc/pki/tls/certs/example.com.crt
             SSLCertificateKeyFile /etc/pki/tls/private/example.com.key
             SSLCACertificateFile /etc/pki/tls/certs/root-certificate.crt  #  If using a self-signed certificate or a root certificate provided by ca-certificates, omit this line

             ServerAdmin info@example.com
             ServerName www.example.com
             DocumentRoot /var/www/example.com/public_html/
             ErrorLog /var/www/example.com/logs/error.log
             CustomLog /var/www/example.com/logs/access.log combined
        </VirtualHost>
        ~~~

2.  Restart Apache:

        systemctl restart httpd

You should now be able to visit your site with SSL enabled.
