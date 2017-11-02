---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve SSL-enabled websites with the Apache web server.'
keywords: ["apache SSL", "ssl on debian", "web server", "debian", "apache", "ssl", "ubuntu", "ssl on ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssl/ssl-certificates-with-apache-2-on-ubuntu/']
modified: 2016-08-24
modified_by:
  name: Nick Brewer
published: 2014-11-19
title: 'SSL Certificates with Apache on Debian & Ubuntu'
external_resources:
 - '[Apache HTTP Server Version 2.0 Documentation](http://httpd.apache.org/docs/2.4/)'
---

This guide will show you how to enable SSL to secure websites served through Apache on Debian and Ubuntu.

![Apache SSL](/docs/assets/SSL_Certificates_with_Apache_on_Debian_Ubuntu_smg.jpg)

## Before You Begin

This guide assumes that you are running Apache 2.4 or higher on Debian 8 or Ubuntu 14.04 or above. Prior to following this guide, ensure that the following steps have been taken on your Linode:

-  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

-  Complete our [Hosting a Website](/docs/websites/hosting-a-website) guide, and create a site that you wish to secure with SSL.

-  Follow our guide to obtain either a [self-signed](/docs/security/ssl/create-a-self-signed-certificate-on-debian-and-ubuntu) or [commercial](/docs/security/ssl/obtain-a-commercially-signed-ssl-certificate-on-debian-and-ubuntu) SSL certificate.

-  If hosting multiple websites with commercial SSL certificates on the same IP address, use the [Server Name Identification (SNI) extension](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) of TLS. SNI is accepted by most modern web browsers. If you expect to receive connections from clients running legacy browsers (like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.


## Configure Apache to use the SSL Certificate

1.  Edit the virtual host configuration files located in `/etc/apache2/sites-available` to provide the certificate file paths. For each virtual host, replicate the configuration shown below. Replace each mention of `example.com` with your own domain. You will also need to ensure that the `SSLCACertificateFile` value is configured to point to the `ca-certificates.crt` file updated in the previous step:

    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" aconf >}}
<VirtualHost *:443>
    SSLEngine On
    SSLCertificateFile /etc/ssl/certs/example.com.crt
    SSLCertificateKeyFile /etc/ssl/private/example.com.key
    SSLCACertificateFile /etc/ssl/certs/ca-certificates.crt  #If using a self-signed certificate, omit this line

    ServerAdmin info@example.com
    ServerName www.example.com
    ServerAlias www.example2.com #If using alternate names for a host
			DocumentRoot /var/www/html/example.com/public_html/
    ErrorLog /var/www/html/example.com/log/error.log
    CustomLog /var/www/html/example.com/log/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


2.  Ensure that the Apache SSL module is enabled, and enable the virtualhost configuration:

        a2enmod ssl
        a2ensite example.com

3.  Restart Apache:

        service apache2 restart

4.  If troubleshooting issues, a system reboot may be required.


## Test Your Configuration

After configuration, some browsers may display the site correctly although errors still exist. Test your SSL configuration using the test page at your certificate issuer's website, then perform the following steps.

1.  Check for errors using `openssl s_client`:

        openssl s_client -CApath /etc/ssl/certs/ -connect example.com:443

2.  Perform a deep analysis through the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/)

You should now be able to visit your site with SSL enabled.
