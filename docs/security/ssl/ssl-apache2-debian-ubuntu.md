---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve SSL-enabled websites with the Apache web server.'
keywords: 'apache SSL,ssl on debian,web sever,debian,apache,ssl,ubuntu,ssl on ubuntu'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['security/ssl/ssl-certificates-with-apache-2-on-ubuntu/']
modified: Wednesday, May 6th, 2015
modified_by:
  name: James Stewart
published: 'Wednesday, November 19th, 2014'
title: 'SSL Certificates with Apache on Debian & Ubuntu'
external_resources:
 - '[Apache HTTP Server Version 2.0 Documentation](http://httpd.apache.org/docs/2.4/)'
---

This guide will assist you with enabling SSL for websites served under the Apache web server, in order to ensure secure access to your website and services.

##Prerequisites

This guide assumes that you are running Apache 2.4 or higher on Debian 8 or Ubuntu 14.04 or above. Prior to following this guide, you will also need to ensure that the following steps have been taken on your Linode.

-   Follow our [Getting Started](/docs/getting-started/) guide to configure your Linode.

-   Follow our [Hosting a Website](/docs/websites/hosting-a-website) guide, and create a site that you wish to secure with SSL.

-   Follow our guide for obtaining either a [self signed](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate) or [commercial](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) SSL certificate.

-   If hosting multiple websites with commercial SSL certificates on the same IP address, use the [SNI](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) extension of TLS. SNI is accepted by most modern web browsers. If you expect to receive connections from clients running legacy browsers (Like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.


## Configure Apache to use the SSL Certificate

1.  Edit the virtual host configuration files located in `/etc/apache2/sites-available`, to provide the certificate file paths. For each virtual host, replicate the configuration shown below. Replace any mentions of `example.com` with your own domain. You will also need to ensure that the `SSLCACertificateFile` value is configured to point to the ca-certificates.crt file updated in the previous step:

    {: .file-excerpt }
    /etc/apache2/sites-available/example.com.conf
    :   ~~~ apache
        <VirtualHost *:443>
            SSLEngine On
            SSLCertificateFile /etc/ssl/certs/example.com.crt
            SSLCertificateKeyFile /etc/ssl/private/example.com.key
            SSLCACertificateFile /etc/ssl/certs/ca-certificates.crt  # If using a self-signed certificate, omit this line

            ServerAdmin info@example.com
            ServerName www.example.com
            DocumentRoot /var/www/example.com/public_html/
            ErrorLog /var/www/example.com/log/error.log
            CustomLog /var/www/example.com/log/access.log combined
        </VirtualHost>
        ~~~

2.  Ensure that the Apache SSL module is enabled, and enable the virtualhost configuration:

        a2enmod ssl

3.  Restart Apache:

        service apache2 restart

(If troubleshooting problems, a reboot may be required.)

  {: .note}
>
> Your installation can appear to be correct in some browsers while not actually being correct, so test your installation using the test page at your certificate issuer's website. Alternately you can run `openssl s_client -CApath /etc/ssl/certs/ -connect example.com:443` and check for errors.

You should now be able to visit your site with SSL enabled.
