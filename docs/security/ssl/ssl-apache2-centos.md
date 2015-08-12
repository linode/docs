---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve SSL-enabled websites with the HTTPD web server.'
keywords: 'apache SSL,ssl on centos,ssl on fedora,ssl,contos,fedora,apache,httpd'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, May 6th, 2015
modified_by:
  name: James Stewart
published: 'Wednesday, November 19th, 2014'
title: 'SSL Certificates with Apache on CentOS 7'
external_resources:
 - '[Apache HTTP Server Version 2.0 Documentation](http://httpd.apache.org/docs/2.0/)'
 - '[Setting up an SSL Secured Webserver with CentOS](http://wiki.centos.org/HowTos/Https)'
---

This guide will assist you with enabling SSL for websites served with the Apache2 web server, in order to ensure secure access to your website and services.

##Prerequisites

This guide assumes that you are running Apache2 on CentOS or Fedora. Prior to following this guide, you will also need to ensure that the following steps have been taken on your Linode:

-   Follow our [Getting Started](/docs/getting-started/) guide to configure your Linode.

-   Follow our [Hosting a Website](/docs/websites/hosting-a-website) guide, and create a site that you wish to secure with SSL.

-   Follow our guide for obtaining either a [self signed](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate) or [commercial](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) SSL certificate.

-   In order to configure your Linode to function with SSL, you will need to ensure that mod_ssl and OpenSSL are installed on your system.  You can do so by running the following command:

        yum install mod_ssl openssl

-   If hosting multiple websites with commercial SSL certificates on the same IP address, use the [SNI](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) extension of TLS. SNI is accepted by most modern web browsers. If you expect to receive connections from clients running legacy browsers (Like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.

##Get the CA Root Certificate

{: .note }
> If you're using a self-signed certificate, skip this step.

Download the root certificate for the provider that issued your commercial certificate before you can begin using it. You may obtain the root certs for various providers from these sites:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://secure.globalsign.net)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

Most providers will provide a root certificate file as either a .cer or .pem file. Save the provided root certificate in `/etc/ssl/localcerts`.

## Configure Apache to use the Signed SSL Certificate

1.  Edit the virtual host entries in the `/etc/httpd/conf/httpd.conf` file to provide the certificate files that should be used by each domain. For each virtual host, you will need to replicate the configuration shown below. Replace any mentions of `example.com` with your own domain. Ensure that the `SSLCACertificateFile` value is configured to point to the CA root certificate downloaded in the previous step:

    {: .file-excerpt }
    /etc/httpd/conf.d/vhost.conf
    :   ~~~ apache
        <VirtualHost *:443>
             SSLEngine On
             SSLCertificateFile /etc/ssl/localcerts/www.example.com.crt
             SSLCertificateKeyFile /etc/ssl/localcerts/www.example.com.key
             SSLCACertificateFile /etc/ssl/localcerts/ca.pem

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
